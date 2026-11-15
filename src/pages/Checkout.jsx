import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore, useQuote } from '../store';
import { api, friendly, rememberOrder } from '../api';
import { fmt, giftNotes } from '../data';
import { Wordmark } from '../components/Chrome';
import { Totals, payable, hasUnpriced, UNPRICED_MSG } from '../components/Summary';
import { Field, Btn, Label, H2, ErrorBox, PX, cx } from '../components/ui';
import usePageMeta from '../usePageMeta';

const Sec = ({ title, right, children }) => (
  <section className="flex flex-col gap-3.5">
    <div className="flex items-baseline justify-between"><H2 className="text-[28px]">{title}</H2>{right}</div>{children}
  </section>
);

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const el = document.createElement('script');
    el.src = 'https://checkout.razorpay.com/v1/checkout.js';
    el.onload = () => resolve(window.Razorpay);
    el.onerror = () => reject(new Error('Could not reach Razorpay. Please try again.'));
    document.body.appendChild(el);
  });
}
// Resolves with the fields /checkout/complete verifies. A failed attempt is only reported (onFailed): Razorpay lets
// the customer retry inside the same modal. The modal closing without a successful payment rejects (DISMISSED).
// onPaid runs inside the success handler, before the promise resolves, so the proof is saved even if the page goes.
const payWithRazorpay = (prepared, prefill, { onFailed, onPaid }) => new Promise((resolve, reject) => {
  loadRazorpay().then(Razorpay => {
    let paid = false, lastFailure = '';
    const rz = new Razorpay({
      key: prepared.razorpayKeyId, order_id: prepared.razorpayOrderId, amount: Math.round(prepared.amount * 100), currency: 'INR',
      name: 'Kesar Mahal', prefill, theme: { color: '#6B1426' },
      handler: r => {
        paid = true;
        const proof = { razorpayPaymentId: r.razorpay_payment_id, razorpayOrderId: r.razorpay_order_id, razorpaySignature: r.razorpay_signature };
        onPaid(proof);
        resolve(proof);
      },
      // A short delay: Razorpay can fire ondismiss in the same moment as handler, and the handler must win.
      modal: { ondismiss: () => { setTimeout(() => { if (!paid) reject(Object.assign(new Error(lastFailure || 'Payment cancelled. You have not been charged.'), { code: 'DISMISSED' })); }, 400); } }
    });
    rz.on('payment.failed', e => { lastFailure = e?.error?.description || 'Payment failed.'; onFailed(`${lastFailure} You can try again.`); });
    rz.open();
  }).catch(reject);
});

// A payment Razorpay reported as successful, kept until the server confirms the order, so a reload finishes
// /checkout/complete (idempotent) instead of inviting a second payment.
const PENDING_KEY = 'km_pending_payment';
const readPending = () => { try { return JSON.parse(localStorage.getItem(PENDING_KEY)) || null; } catch { return null; } };
const writePending = v => { try { if (v) localStorage.setItem(PENDING_KEY, JSON.stringify(v)); else localStorage.removeItem(PENDING_KEY); } catch { /* storage unavailable */ } };
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 15000];
const sleep = ms => new Promise(r => setTimeout(r, ms));
// Worth retrying: no connection, rate limit, a server error, or another caller (the webhook) still fulfilling.
const transient = e => e?.code === 'NETWORK' || e?.code === 'CHECKOUT_IN_PROGRESS' || e?.status === 409 || e?.status === 429 || e?.status >= 500;
async function confirmPaid(p) {
  for (let i = 0; ; i++) {
    try {
      return await api.complete({ checkoutId: p.checkoutId, checkoutToken: p.checkoutToken, razorpayPaymentId: p.razorpayPaymentId, razorpayOrderId: p.razorpayOrderId, razorpaySignature: p.razorpaySignature });
    } catch (e) {
      if (!transient(e) || i >= RETRY_DELAYS.length) throw e;
      await sleep(RETRY_DELAYS[i]);
    }
  }
}

// Same rules as the backend's server/validators.js: a 10-digit Indian mobile starting 6-9; +91 / 0 prefixes are dropped.
const PHONE_REGEX = /^[6-9]\d{9}$/;
const stripPhonePrefix = raw => {
  const d = String(raw ?? '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  if (d.length === 11 && d.startsWith('0')) return d.slice(1);
  return d;
};
const normalizePhone = raw => { const d = stripPhonePrefix(raw); return PHONE_REGEX.test(d) ? d : null; };

const FIELDS = ['name', 'phone', 'email', 'line1', 'city', 'pincode'];
const validate = f => {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter your full name (at least 2 letters).';
  if (!normalizePhone(f.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address, like name@example.com.';
  if (f.line1.trim().length < 5) e.line1 = 'Enter your address (at least 5 characters).';
  if (f.city.trim().length < 2) e.city = 'Enter your city.';
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Enter a 6-digit PIN code.';
  return e;
};
const LABELS = { name: 'Full name', phone: 'Mobile', email: 'Email', line1: 'Address', city: 'City', pincode: 'PIN code' };
const UNAVAILABLE = 'Online payment is temporarily unavailable. Please try again in a little while.';

export default function Checkout() {
  usePageMeta('Checkout');
  const { lines, gifts, user, settings, settingsError, loadSettings, byId, clear } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', phone: '', email: '', line1: '', landmark: '', city: '', pincode: '' });
  const [saved, setSaved] = useState([]);
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null); // validated code applied to the quote
  const [couponMsg, setCouponMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false); // after the first submit attempt, errors show live as the customer fixes them
  // A paid-but-unconfirmed payment: 'confirming' while /complete is retried, 'stuck' once retries ran out.
  const [pending, setPending] = useState(readPending);
  const [confirm, setConfirm] = useState(() => (readPending() ? 'confirming' : ''));
  const lock = useRef(false);
  const finishing = useRef(false);
  const phone = normalizePhone(f.phone);
  const { status, quote, error } = useQuote(coupon, phone || undefined);

  function fillAddress(a, onlyEmpty) {
    setF(s => (onlyEmpty && s.line1 ? s : { ...s, line1: [a.line1, a.line2].filter(Boolean).join(', '), landmark: a.landmark || '', city: a.city || '', pincode: a.pincode || '' }));
  }

  // Logged-in customers: prefill from the account and the default saved address.
  useEffect(() => {
    if (!user) return;
    setF(s => ({ ...s, name: s.name || user.username || '', phone: s.phone || normalizePhone(user.phone) || '', email: s.email || user.email || '' }));
    api.addresses().then(rows => {
      setSaved(rows);
      const d = rows.find(a => a.isDefault) || rows[0];
      if (d) fillAddress(d, true);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function finish(p) {
    if (!p || finishing.current) return;
    finishing.current = true;
    setConfirm('confirming'); setErr('');
    try {
      const done = await confirmPaid(p);
      const order = done.order || done.orders?.[0];
      if (!order) {
        setConfirm('stuck');
        setErr('Your payment was received, but the order could not be shown here. Check My orders in your account, or contact us with your phone number.');
        return;
      }
      writePending(null);
      rememberOrder(order, done.parentOrder);
      clear(); // only once the server has confirmed the order
      nav(`/confirmed/${order.id}`, { replace: true });
    } catch (ex) {
      // Retries ran out, or the server refused. The money may already have moved, so Pay stays gone.
      setConfirm('stuck');
      setErr(transient(ex) ? '' : friendly(ex));
    } finally {
      finishing.current = false;
    }
  }

  // Paid, then the page was reloaded or the connection dropped: finish confirming. Never start a new payment.
  const resumed = useRef(false);
  useEffect(() => {
    if (!pending || resumed.current) return;
    resumed.current = true;
    lock.current = true;
    finish(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After every hook. A confirmed order clears the bag before navigation; pending must win that render,
  // or the empty bag would send a customer who just paid back to the bag.
  if (pending) {
    const retry = () => finish(pending);
    return (
      <div className="pb-24 lg:pb-0">
        <div className={cx('flex items-center justify-between border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} className="items-start" /><span className="text-[13px] text-muted">Secure checkout</span></div>
        <div className={cx('mx-auto flex max-w-[640px] flex-col gap-4 py-14', PX)} role="status" aria-live="polite">
          <H2 className="text-[32px]">Payment received, confirming your order</H2>
          {confirm === 'confirming' ? (
            <p className="text-[15px] font-light">We are confirming your order with our store. This can take a few seconds; please keep this page open. You will not be charged again.</p>
          ) : (
            <>
              <p className="text-[15px] font-light">Your payment went through, but we could not confirm your order yet. <b className="font-medium">Please do not pay again.</b> Check again here, or look in My orders. If the order cannot be placed, the payment is refunded.</p>
              {err && <ErrorBox>{err}</ErrorBox>}
              <p className="text-[13.5px] text-muted">If it does not appear within an hour, <Link to="/contact" className="underline">contact us</Link> with this payment reference: <span className="font-mono">{pending.razorpayPaymentId}</span>.</p>
              <div className="flex flex-wrap gap-3"><Btn type="button" onClick={retry}>CHECK AGAIN</Btn>{user && <Btn to="/account" ghost>MY ORDERS</Btn>}</div>
            </>
          )}
        </div>
      </div>
    );
  }
  if (!lines.length) return <Navigate to="/bag" replace />;

  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const errors = tried ? validate(f) : {};
  const errList = FIELDS.filter(k => errors[k]);
  // Kesar Mahal is online payment only. Pay on delivery is never offered, whatever settings say.
  const online = Boolean(settings && !settingsError && settings.razorpayEnabled && settings.razorpayKeyId);
  const total = quote ? payable(quote) : 0;
  const blocked = hasUnpriced(quote);

  const applyCoupon = async () => {
    const c = code.trim();
    if (!c) return;
    setCouponMsg('');
    if (!phone && !user) return setCouponMsg('Enter your mobile number above first; coupons are checked against it.');
    try {
      const r = await api.validateCoupon(c, lines.map(l => ({ id: l.productId, sizeId: l.sizeId, quantity: l.qty })), phone || undefined);
      if (r.valid) { setCoupon(r.code); setCouponMsg(''); } else setCouponMsg(r.message || friendly({ code: r.reason }));
    } catch (e) { setCouponMsg(friendly(e)); }
  };

  const submit = async e => {
    e.preventDefault();
    if (lock.current || !quote || blocked || !online) return;
    const bad = FIELDS.filter(k => validate(f)[k]);
    if (bad.length) { setTried(true); document.getElementById(`co-${bad[0]}`)?.focus(); return; }
    lock.current = true; setBusy(true); setErr('');
    let checkoutId = '';
    try {
      const expected = total;
      const prepared = await api.prepare({
        customerName: f.name.trim(), customerPhone: phone, customerEmail: f.email.trim(),
        lines: lines.map(l => ({ id: l.productId, sizeId: l.sizeId, quantity: l.qty })),
        paymentMethod: 'online',
        ...(giftNotes(lines, gifts) ? { notes: giftNotes(lines, gifts) } : {}),
        ...(coupon ? { couponCode: coupon } : {}),
        deliveryAddress: { line1: f.line1.trim(), landmark: f.landmark.trim(), city: f.city.trim(), pincode: f.pincode }
      });
      checkoutId = prepared.checkoutId;
      // The amount the server will charge must equal the total we showed. If not, stop before any payment.
      if (Math.abs(prepared.amount - expected) > 0.005) throw Object.assign(new Error(`The total changed to ${fmt(prepared.amount)}. Please review your bag and try again.`), { code: 'TOTAL_CHANGED' });
      const remember = proof => writePending({ checkoutId, checkoutToken: prepared.checkoutToken, ...proof, at: new Date().toISOString() });
      const proof = await payWithRazorpay(prepared, { name: f.name, contact: phone, email: f.email }, { onFailed: setErr, onPaid: remember });
      // From here the customer has paid: never abandon this checkout, and never show Pay again.
      const stored = readPending() || { checkoutId, checkoutToken: prepared.checkoutToken, ...proof, at: new Date().toISOString() };
      writePending(stored);
      checkoutId = '';
      setPending(stored);
      finish(stored);
    } catch (ex) {
      // No successful payment (dismiss, or a failure before the modal took money). Release the held coupon.
      if (checkoutId) api.abandon(checkoutId);
      setErr(friendly(ex));
      lock.current = false; setBusy(false);
    }
  };

  const payBox = settingsError ? <ErrorBox retry={loadSettings}>{UNAVAILABLE} {settingsError}</ErrorBox>
    : !settings ? 'Loading…'
    : online ? <><b className="font-medium">Pay online</b><br /><span className="font-light">UPI, card or netbanking via Razorpay.</span></>
    : <span className="text-kesar">{UNAVAILABLE}</span>;
  const payDisabled = busy || !quote || blocked || !online;
  const payLabel = busy ? 'PLACING ORDER…' : online ? `PAY ${fmt(total)}` : 'PAYMENT UNAVAILABLE';

  return (
    <form onSubmit={submit} noValidate id="checkout-form" className="pb-24 lg:pb-0">
      <div className={cx('flex items-center justify-between border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} className="items-start" /><span className="text-[13px] text-muted">Secure checkout</span></div>
      <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className={cx('flex flex-col gap-8 pb-16 pt-11', PX)}>
          {errList.length > 0 && (
            <div role="alert" className="border border-kesar bg-ivory p-4 text-[14.5px] text-kesar">
              <p className="font-medium">Please fix {errList.length === 1 ? 'this field' : `these ${errList.length} fields`} to continue:</p>
              <ul className="mt-1.5 list-disc pl-5">{errList.map(k => <li key={k}><a href={`#co-${k}`} className="underline" onClick={e => { e.preventDefault(); document.getElementById(`co-${k}`)?.focus(); }}>{LABELS[k]}</a>: {errors[k]}</li>)}</ul>
            </div>
          )}
          <Sec title="I · Contact" right={!user && <span className="text-[13.5px]">Have an account? <Link to="/signin?next=/checkout" className="border-b border-maroon text-maroon">Sign in</Link></span>}>
            <Field id="co-name" error={errors.name} label="Full name" required minLength={2} maxLength={60} autoComplete="name" value={f.name} onChange={set('name')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="co-phone" error={errors.phone} label="Mobile (10 digits)" required inputMode="numeric" autoComplete="tel-national" maxLength={16} title="10-digit Indian mobile number" value={f.phone} onChange={e => setF(s => ({ ...s, phone: stripPhonePrefix(e.target.value.replace(/\D/g, '').slice(0, 12)) }))} placeholder="98765 43210" />
              <Field id="co-email" error={errors.email} label="Email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} />
            </div>
          </Sec>
          <Sec title="II · Deliver to">
            {saved.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Saved addresses">
                {saved.map(a => <button type="button" key={a.id} onClick={() => fillAddress(a)} className="rounded-full border border-maroon px-4 py-2 text-[13px] text-maroon">{a.label}</button>)}
              </div>
            )}
            <Field id="co-line1" error={errors.line1} label="Address" required minLength={5} maxLength={120} autoComplete="address-line1" value={f.line1} onChange={set('line1')} />
            <Field id="co-landmark" label="Landmark (optional)" maxLength={80} autoComplete="address-line2" value={f.landmark} onChange={set('landmark')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="co-city" error={errors.city} label="City" required minLength={2} autoComplete="address-level2" value={f.city} onChange={set('city')} />
              <Field id="co-pincode" error={errors.pincode} label="PIN code" required inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} title="6-digit pincode" value={f.pincode} onChange={e => setF(s => ({ ...s, pincode: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <p className="text-[13px] font-light text-muted">We ship the pantry range anywhere in India.</p>
          </Sec>
          <Sec title="III · Payment">
            <div className="border border-maroon bg-ivory p-4 text-[14.5px]">{payBox}</div>
          </Sec>
        </div>
        <aside className="flex flex-col gap-4 self-stretch border-t border-line bg-ivory px-6 py-11 text-[14.5px] lg:border-l lg:border-t-0 lg:px-8" aria-busy={status === 'loading'}>
          <Label className="text-goldtext">Order · {lines.length} item{lines.length > 1 ? 's' : ''}</Label>
          {error && <ErrorBox>{friendly(error)} <Link to="/bag" className="underline">Back to bag</Link></ErrorBox>}
          {quote && (
            <div className="flex flex-col gap-2">
              {quote.lines.map((l, i) => (
                <div key={i} className="flex justify-between gap-3"><span className="font-light">{byId(l.productId)?.name || l.name}{l.sizeLabel ? `, ${l.sizeLabel}` : ''}{l.quantity > 1 ? ` × ${l.quantity}` : ''}</span><span>{fmt(l.baseAmount)}</span></div>
              ))}
            </div>
          )}
          <div>
            <div className="flex border border-field focus-within:border-maroon focus-within:ring-2 focus-within:ring-maroon">
              <input aria-label="Coupon code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }} placeholder="Coupon code" className="w-full bg-transparent px-3.5 py-2.5 text-[15px]" disabled={Boolean(coupon)} />
              {coupon ? <button type="button" className="px-4 text-[13px] text-maroon" onClick={() => { setCoupon(null); setCode(''); }}>REMOVE</button> : <button type="button" className="px-4 text-[13px] text-maroon" onClick={applyCoupon}>APPLY</button>}
            </div>
            {couponMsg && <p role="alert" className="mt-1.5 text-[13px] text-kesar">{couponMsg}</p>}
            {quote?.coupon && !quote.coupon.valid && <p role="alert" className="mt-1.5 text-[13px] text-kesar">{quote.coupon.message || friendly({ code: quote.coupon.reason })}</p>}
          </div>
          {quote ? <Totals quote={quote} /> : <span className="font-light text-muted">{status === 'loading' ? 'Pricing your order…' : 'Totals unavailable.'}</span>}
          {blocked && <ErrorBox>{UNPRICED_MSG} <Link to="/bag" className="underline">Back to bag</Link></ErrorBox>}
          {err && <ErrorBox>{err}</ErrorBox>}
          <Btn disabled={payDisabled} aria-busy={busy}>{payLabel}</Btn>
          {quote && <span className="text-center text-[13.5px] text-muted">Total includes GST of {fmt(quote.totals.taxTotal)}.</span>}
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-ivory px-5 py-3 lg:hidden">
        <div className="flex flex-col leading-tight"><span className="text-[12px] text-muted">Total</span><span className="font-display text-[22px] font-medium">{quote ? fmt(total) : '…'}</span></div>
        <Btn className="flex-1" disabled={payDisabled} aria-busy={busy}>{busy ? 'PLACING ORDER…' : online ? 'PAY NOW' : 'PAYMENT UNAVAILABLE'}</Btn>
      </div>
    </form>
  );
}
