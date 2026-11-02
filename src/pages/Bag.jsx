import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { fmt, FREE_SHIP, SPOONUP_CREDIT } from '../data';
import { Photo, Badge, Qty, Btn, Label, H1, Lines, Line, TextBtn, PX, cx } from '../components/ui';

export default function Bag() {
  const { items, setQty, remove, subtotal, credit, useCredit, setUseCredit, user, freeShip } = useStore();
  const nav = useNavigate();
  if (!items.length) return (
    <div className="flex flex-col items-center gap-[18px] px-6 py-[120px] text-center"><H1>Your bag is empty.</H1><p>The pantry is waiting.</p><Btn to="/shop">SHOP THE HARVEST</Btn></div>
  );
  const edit = i => { remove(i.key); nav('/gift', { state: i.gift }); };
  return (
    <div className={cx('grid items-start gap-12 pb-[72px] pt-12 lg:grid-cols-[minmax(0,1fr)_400px]', PX)}>
      <div className="flex flex-col gap-6">
        <H1 className="text-[clamp(38px,4.4vw,54px)]">Your bag</H1>
        <div className="flex flex-col gap-2.5 border border-line bg-ivory px-5 py-4 text-sm">
          <span>{freeShip ? <>You’ve unlocked <b className="font-medium text-pine">free shipping</b> on this order.</> : <>Add <b>{fmt(FREE_SHIP - subtotal)}</b> more for free shipping.</>}</span>
          <div className="h-1 bg-line2"><div className="h-full bg-pine" style={{ width: Math.min(100, subtotal / FREE_SHIP * 100) + '%' }} /></div>
        </div>
        <div className="border-t border-line">
          {items.map(i => (
            <div key={i.key} className="grid grid-cols-[80px_1fr_auto] items-center gap-x-3.5 gap-y-2 border-b border-line py-[22px] sm:grid-cols-[120px_minmax(0,1fr)_auto_auto] sm:gap-6">
              <div className="aspect-square overflow-hidden sm:row-auto">{i.kind === 'gift' ? <div className="jaali size-full" /> : <Photo src={i.img} label={i.name} />}</div>
              <div><Badge color={i.color}>{i.grade}</Badge><div className="mt-2 font-display text-[25px] font-medium text-maroon">{i.name}</div><div className="text-[13px] text-muted">{i.sub}</div>
                <TextBtn className="mt-1 text-[13px] text-muted" onClick={() => remove(i.key)}>Remove</TextBtn></div>
              {i.kind === 'gift' ? <button className="border-b border-maroon text-[13px] text-maroon" onClick={() => edit(i)}>Edit</button> : <Qty value={i.qty} set={q => setQty(i.key, q)} />}
              <span className="col-start-3 min-w-20 text-right text-[17px] font-medium sm:col-start-auto">{fmt(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
      </div>
      <aside className="flex flex-col gap-3.5 border border-line bg-ivory p-7 text-[14.5px] lg:mt-[78px]">
        <Label className="text-gold">Summary</Label>
        <Lines><Line><span className="font-light">Subtotal</span><span>{fmt(subtotal)}</span></Line><Line><span className="font-light">Shipping</span><span className="text-pine">{freeShip ? 'Free' : 'Calculated at checkout'}</span></Line></Lines>
        {user ? (
          <label className="flex items-center justify-between border border-dashed border-gold bg-paper px-3.5 py-3"><span><b className="font-medium">Spoonup credit</b><br /><small className="text-[12.5px] text-muted">{fmt(SPOONUP_CREDIT)} available · apply</small></span>
            <input type="checkbox" checked={useCredit} onChange={e => setUseCredit(e.target.checked)} className="size-5 accent-maroon" /></label>
        ) : <Link to="/signin" className="flex items-center justify-between border border-dashed border-gold bg-paper px-3.5 py-3"><span><b className="font-medium">Spoonup credit</b><br /><small className="text-[12.5px] text-muted">Sign in to use your credit</small></span><span>→</span></Link>}
        {credit > 0 && <Lines><Line><span className="font-light">Credit applied</span><span>− {fmt(credit)}</span></Line></Lines>}
        <Lines><Line total><span>Total</span><span>{fmt(subtotal - credit)}</span></Line></Lines>
        <Btn to="/checkout" className="mt-1.5">CHECK OUT</Btn>
        <span className="text-center text-[12.5px] text-muted">Ships from Srinagar in 3–5 days</span>
      </aside>
    </div>
  );
}
