import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore, useQuote } from '../store';
import { api, friendly, rememberOrder } from '../api';
import { fmt, giftNotes } from '../data';
import { Wordmark } from '../components/Chrome';
import { Totals, payable } from '../components/Summary';
import { Field, Btn, Label, H2, ErrorBox, PX, cx } from '../components/ui';

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
// Opens Razorpay and resolves with the fields /checkout/complete verifies.
const payWithRazorpay = (prepared, prefill) => new Promise((resolve, reject) => {
  loadRazorpay().then(Razorpay => {
    const rz = new Razorpay({
      key: prepared.razorpayKeyId, order_id: prepared.razorpayOrderId, amount: Math.round(prepared.amount * 100), currency: 'INR',
      name: 'Kesar Mahal', prefill, theme: { color: '#6B1426' },
      handler: r => resolve({ razorpayPaymentId: r.razorpay_payment_id, razorpayOrderId: r.razorpay_order_id, razorpaySignature: r.razorpay_signature }),
      modal: { ondismiss: () => reject(new Error('Payment cancelled.')) }
    });
    rz.on('payment.failed', e => reject(new Error(e?.error?.description || 'Payment failed. Please try again.')));
    rz.open();
  }).catch(reject);
});

export default function Checkout() {
  const { lines, gifts, user, settings, byId, clear } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', phone: '', email: '', line1: '', landmark: '', city: '', pincode: '' });
  const [saved, setSaved] = useState([]);
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null); // validated code applied to the quote
  const [couponMsg, setCouponMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const { status, quote, error } = useQuote(coupon, f.phone.length === 10 ? f.phone : undefined);

  // Logged-in customers: prefill from the account and the default saved address.
  useEffect(() => {
    if (!user) return;
    setF(s => ({ ...s, name: s.name || user.username || '', phone: s.phone || (user.phone || '').replace(/\D/g, '').slice(-10), email: s.email || user.email || '' }));
    api.addresses().then(rows => {
      setSaved(rows);
      const d = rows.find(a => a.isDefault) || rows[0];
      if (d) fillAddress(d, true);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!lines.length) return <Navigate to="/bag" replace />;
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  function fillAddress(a, onlyEmpty) {
    setF(s => (onlyEmpty && s.line1 ? s : { ...s, line1: [a.line1, a.line2].filter(Boolean).join(', '), landmark: a.landmark || '', city: a.city || '', pincode: a.pincode || '' }));
  }

  const online = Boolean(settings?.razorpayEnabled && settings?.razorpayKeyId);
  const total = quote ? payable(quote) : 0;

  const applyCoupon = async () => {
    const c = code.trim();
    if (!c) return;
    setCouponMsg('');
    if (f.phone.length !== 10 && !user) return setCouponMsg('Enter your mobile number above first; coupons are checked against it.');
    try {
      const r = await api.validateCoupon(c, lines.map(l => ({ id: l.productId, sizeId: l.sizeId, quantity: l.qty })), f.phone);
      if (r.valid) { setCoupon(r.code); setCouponMsg(''); } else setCouponMsg(r.message || friendly({ code: r.reason }));
    } catch (e) { setCouponMsg(friendly(e)); }
  };

  const submit = async e => {
    e.preventDefault();
    if (lock.current || !quote) return;
    lock.current = true; setBusy(true); setErr('');
    let checkoutId = '';
    try {
      const expected = total;
      const prepared = await api.prepare({
        customerName: f.name.trim(), customerPhone: f.phone, customerEmail: f.email.trim(),
        lines: lines.map(l => ({ id: l.productId, sizeId: l.sizeId, quantity: l.qty })),
        paymentMethod: online ? 'online' : 'counter',
        ...(giftNotes(lines, gifts) ? { notes: giftNotes(lines, gifts) } : {}),
        ...(coupon ? { couponCode: coupon } : {}),
        deliveryAddress: { line1: f.line1.trim(), landmark: f.landmark.trim(), city: f.city.trim(), pincode: f.pincode }
      });
      checkoutId = prepared.checkoutId;
      // The amount the server will charge must equal the total we showed. If not, stop before any payment.
      if (Math.abs(prepared.amount - expected) > 0.005) throw Object.assign(new Error(`The total changed to ${fmt(prepared.amount)}. Please review your bag and try again.`), { code: 'TOTAL_CHANGED' });
      const proof = online ? await payWithRazorpay(prepared, { name: f.name, contact: f.phone, email: f.email }) : {};
      const done = await api.complete({ checkoutId, checkoutToken: prepared.checkoutToken, ...proof });
      const order = done.order || done.orders?.[0];
      if (!order) throw new Error('Your order was placed but could not be shown. Check your email for confirmation.');
      rememberOrder(order, done.parentOrder);
      clear();
      nav(`/confirmed/${order.id}`, { replace: true });
    } catch (ex) {
      if (checkoutId) api.abandon(checkoutId);
      setErr(friendly(ex));
      lock.current = false; setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <div className={cx('flex items-center justify-between border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} className="items-start" /><span className="text-[13px] text-muted">Secure checkout</span></div>
      <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className={cx('flex flex-col gap-8 pb-16 pt-11', PX)}>
          <Sec title="I · Contact" right={!user && <span className="text-[13.5px]">Have an account? <Link to="/signin?next=/checkout" className="border-b border-maroon text-maroon">Sign in</Link></span>}>
            <Field label="Full name" required minLength={2} maxLength={60} autoComplete="name" value={f.name} onChange={set('name')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Mobile (10 digits)" required inputMode="numeric" autoComplete="tel-national" pattern="[0-9]{10}" maxLength={10} title="10-digit mobile number" value={f.phone} onChange={e => setF(s => ({ ...s, phone: e.target.value.replace(/\D/g, '') }))} placeholder="98765 43210" />
              <Field label="Email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} />
            </div>
          </Sec>
          <Sec title="II · Deliver to">
            {saved.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Saved addresses">
                {saved.map(a => <button type="button" key={a.id} onClick={() => fillAddress(a)} className="rounded-full border border-maroon px-4 py-2 text-[13px] text-maroon">{a.label}</button>)}
              </div>
            )}
            <Field label="Address" required minLength={5} maxLength={120} autoComplete="address-line1" value={f.line1} onChange={set('line1')} />
            <Field label="Landmark (optional)" maxLength={80} value={f.landmark} onChange={set('landmark')} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="City" required minLength={2} autoComplete="address-level2" value={f.city} onChange={set('city')} />
              <Field label="PIN code" required inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} title="6-digit pincode" value={f.pincode} onChange={e => setF(s => ({ ...s, pincode: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <p className="text-[13px] font-light text-muted">We ship the pantry range anywhere in India.</p>
          </Sec>
          <Sec title="III · Payment">
            <div className="border border-maroon bg-ivory p-4 text-[14.5px]">
              {settings === null ? 'Loading…' : online ? <><b className="font-medium">Pay online</b><br /><span className="font-light">UPI, card or netbanking via Razorpay.</span></>
                : <><b className="font-medium">Pay on delivery</b><br /><span className="font-light">Online payment is not switched on for this store yet. Your order is placed now and paid when it arrives.</span></>}
            </div>
          </Sec>
        </div>
        <aside className="flex flex-col gap-4 self-stretch border-t border-line bg-ivory px-6 py-11 text-[14.5px] lg:border-l lg:border-t-0 lg:px-8" aria-busy={status === 'loading'}>
          <Label className="text-gold">Order · {lines.length} item{lines.length > 1 ? 's' : ''}</Label>
          {error && <ErrorBox>{friendly(error)} <Link to="/bag" className="underline">Back to bag</Link></ErrorBox>}
          {quote && (
            <div className="flex flex-col gap-2">
              {quote.lines.map((l, i) => (
                <div key={i} className="flex justify-between gap-3"><span className="font-light">{byId(l.productId)?.name || l.name}{l.sizeLabel ? `, ${l.sizeLabel}` : ''}{l.quantity > 1 ? ` × ${l.quantity}` : ''}</span><span>{fmt(l.baseAmount)}</span></div>
              ))}
            </div>
          )}
          <div>
            <div className="flex border border-line focus-within:border-maroon">
              <input aria-label="Coupon code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }} placeholder="Coupon code" className="w-full bg-transparent px-3.5 py-2.5 text-[15px]" disabled={Boolean(coupon)} />
              {coupon ? <button type="button" className="px-4 text-[13px] text-maroon" onClick={() => { setCoupon(null); setCode(''); }}>REMOVE</button> : <button type="button" className="px-4 text-[13px] text-maroon" onClick={applyCoupon}>APPLY</button>}
            </div>
            {couponMsg && <p role="alert" className="mt-1.5 text-[13px] text-kesar">{couponMsg}</p>}
            {quote?.coupon && !quote.coupon.valid && <p role="alert" className="mt-1.5 text-[13px] text-kesar">{quote.coupon.message || friendly({ code: quote.coupon.reason })}</p>}
          </div>
          {quote ? <Totals quote={quote} /> : <span className="font-light text-muted">{status === 'loading' ? 'Pricing your order…' : 'Totals unavailable.'}</span>}
          {err && <ErrorBox>{err}</ErrorBox>}
          <Btn disabled={busy || !quote || settings === null} aria-busy={busy}>{busy ? 'PLACING ORDER…' : online ? `PAY ${fmt(total)}` : `PLACE ORDER · ${fmt(total)}`}</Btn>
          <span className="text-center text-[12.5px] text-muted">GST is included in the total above.</span>
        </aside>
      </div>
    </form>
  );
}
