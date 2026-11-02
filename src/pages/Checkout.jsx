import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Wordmark } from '../components/Chrome';
import { Field, Btn, Label, H2, Lines, Line, PX, cx } from '../components/ui';
import { fmt, FREE_SHIP } from '../data';

const Sec = ({ title, right, children }) => (
  <section className="flex flex-col gap-3.5">
    <div className="flex items-baseline justify-between"><H2 className="text-[28px]">{title}</H2>{right}</div>{children}
  </section>
);
const Radio = ({ on, set, children, right }) => (
  <button type="button" onClick={set} className="flex w-full items-center justify-between border-b border-line p-4 text-left last:border-0">
    <span className="flex items-center gap-3"><i className={cx('size-4 rounded-full border', on ? 'border-[5px] border-maroon' : 'border-muted')} />{children}</span>{right}
  </button>
);
const choice = on => cx('flex flex-col gap-1 border bg-ivory p-4 text-left', on ? 'border-[1.5px] border-maroon p-[15.5px]' : 'border-line');

export default function Checkout() {
  const { items, subtotal, credit, user, placeOrder } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ mobile: user?.mobile || '', email: user?.email || '', name: '', line: '', city: '', pin: '', giftTo: false });
  const [ship, setShip] = useState('std');
  const [pay, setPay] = useState('UPI');
  if (!items.length) return <Navigate to="/bag" replace />;
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const shipFee = ship === 'exp' ? 249 : subtotal >= FREE_SHIP ? 0 : 99;
  const total = subtotal + shipFee - credit;
  const submit = e => {
    e.preventDefault();
    // ponytail: no payment gateway yet; this records the order locally. Wire Razorpay/UPI here.
    const o = placeOrder({ shipping: ship, shipFee, form: f });
    nav('/confirmed/' + o.id, { state: { name: f.name.split(' ')[0] } });
  };
  return (
    <form onSubmit={submit}>
      <div className={cx('flex items-center justify-between border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} className="items-start" /><span className="text-[13px] text-muted">Secure checkout</span></div>
      <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className={cx('flex flex-col gap-8 pb-16 pt-11', PX)}>
          <Sec title="I · Contact" right={!user && <span className="text-[13.5px]">Have a Spoonup account? <Link to="/signin" className="border-b border-maroon text-maroon">Sign in</Link></span>}>
            <div className="grid gap-3 sm:grid-cols-2"><Field label="Mobile" required inputMode="tel" value={f.mobile} onChange={set('mobile')} placeholder="+91 98765 43210" /><Field label="Email" type="email" required value={f.email} onChange={set('email')} /></div>
          </Sec>
          <Sec title="II · Deliver to">
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" className={choice(!f.giftTo)} onClick={() => setF(s => ({ ...s, giftTo: false }))}><b className="font-medium">Me</b><span className="text-[13.5px] font-light">Deliver to my address</span></button>
              <button type="button" className={choice(f.giftTo)} onClick={() => setF(s => ({ ...s, giftTo: true }))}><b className="font-medium">Send as a gift</b><span className="text-[13.5px] font-light">Ship straight to someone else. Prices stay hidden.</span></button>
            </div>
            <Field label={f.giftTo ? 'Recipient name' : 'Full name'} required value={f.name} onChange={set('name')} />
            <Field label="Address" required value={f.line} onChange={set('line')} />
            <div className="grid gap-3 sm:grid-cols-2"><Field label="City" required value={f.city} onChange={set('city')} /><Field label="PIN code" required pattern="\d{6}" inputMode="numeric" value={f.pin} onChange={set('pin')} /></div>
          </Sec>
          <Sec title="III · Shipping">
            <div className="border border-line bg-ivory">
              <Radio on={ship === 'std'} set={() => setShip('std')} right={<span className="text-pine">{subtotal >= FREE_SHIP ? 'Free' : fmt(99)}</span>}>Standard · 3–5 days</Radio>
              <Radio on={ship === 'exp'} set={() => setShip('exp')} right={fmt(249)}>Express · 1–2 days</Radio>
            </div>
          </Sec>
          <Sec title="IV · Payment">
            <div className="grid gap-3 sm:grid-cols-3">{['UPI', 'Card', 'Pay on delivery'].map(m => <button type="button" key={m} onClick={() => setPay(m)} className={cx(choice(pay === m), 'items-center text-center')}>{m}</button>)}</div>
          </Sec>
        </div>
        <aside className="flex flex-col gap-4 self-stretch border-t border-line bg-ivory px-6 py-11 text-[14.5px] lg:border-l lg:border-t-0 lg:px-8">
          <Label className="text-gold">Order · {items.length} item{items.length > 1 ? 's' : ''}</Label>
          <Lines>
            {items.map(i => <Line key={i.key}><span className="font-light">{i.name}{i.kind === 'item' ? `, ${i.sub.split(' ·')[0]}` : ''}{i.qty > 1 ? ` × ${i.qty}` : ''}</span><span>{fmt(i.price * i.qty)}</span></Line>)}
            <Line><span className="font-light">Shipping</span><span>{shipFee ? fmt(shipFee) : 'Free'}</span></Line>
            {credit > 0 && <Line className="text-pine"><span>Spoonup credit</span><span>− {fmt(credit)}</span></Line>}
            <Line total><span>Total</span><span>{fmt(total)}</span></Line>
          </Lines>
          <Btn>PAY {fmt(total)}</Btn>
          {items.filter(i => i.kind === 'gift' && i.gift.note).map(i => <div key={i.key} className="border border-line p-3.5 font-display text-[17px] italic leading-[1.4] text-maroon">Note in the {i.name.split(' ·')[0]} box: “{i.gift.note}”</div>)}
        </aside>
      </div>
    </form>
  );
}
