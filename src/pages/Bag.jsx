import { useStore, useQuote } from '../store';
import { fmt, lineKey } from '../data';
import { Photo, Badge, Qty, Btn, Label, H1, ErrorBox, TextBtn, PX, cx } from '../components/ui';
import { Totals } from '../components/Summary';
import { friendly } from '../api';

export default function Bag() {
  const { lines, setQty, remove, byId, catalogue } = useStore();
  const { status, quote, error } = useQuote();
  if (!lines.length) return (
    <div className="flex flex-col items-center gap-[18px] px-6 py-[120px] text-center"><H1>Your bag is empty.</H1><p>The pantry is waiting.</p><Btn to="/shop">SHOP THE HARVEST</Btn></div>
  );
  const priced = new Map((quote?.lines || []).map(l => [lineKey(l.productId, l.sizeId), l]));
  return (
    <div className={cx('grid items-start gap-12 pb-[72px] pt-12 lg:grid-cols-[minmax(0,1fr)_400px]', PX)}>
      <div className="flex flex-col gap-6">
        <H1 className="text-[clamp(38px,4.4vw,54px)]">Your bag</H1>
        {error && <ErrorBox>{friendly(error)}</ErrorBox>}
        <div className="border-t border-line">
          {lines.map(l => {
            const key = lineKey(l.productId, l.sizeId);
            const p = byId(l.productId);
            const q = priced.get(key);
            const label = p?.sizes.find(s => s.id === l.sizeId)?.label;
            return (
              <div key={key} className="grid grid-cols-[80px_1fr_auto] items-center gap-x-3.5 gap-y-2 border-b border-line py-[22px] sm:grid-cols-[120px_minmax(0,1fr)_auto_auto] sm:gap-6">
                <div className="aspect-square overflow-hidden"><Photo src={p?.img} label={p?.name || ''} /></div>
                <div>{p && <Badge color={p.color}>{p.category}</Badge>}<div className="mt-2 font-display text-[25px] font-medium text-maroon">{p?.name || l.productId}</div>
                  <div className="text-[13px] text-muted">{[label, q && `${fmt(q.unitPrice)} each`].filter(Boolean).join(' · ')}</div>
                  <TextBtn className="mt-1 text-[13px] text-muted" onClick={() => remove(key)}>Remove</TextBtn></div>
                <Qty value={l.qty} set={n => setQty(key, n)} />
                <span className="col-start-3 min-w-20 text-right text-[17px] font-medium sm:col-start-auto">{q ? fmt(q.baseAmount) : '…'}</span>
              </div>
            );
          })}
        </div>
      </div>
      <aside className="flex flex-col gap-3.5 border border-line bg-ivory p-7 text-[14.5px] lg:mt-[78px]" aria-busy={status === 'loading'}>
        <Label className="text-gold">Summary</Label>
        {quote ? <Totals quote={quote} /> : <span className="font-light text-muted">{status === 'loading' ? 'Pricing your bag…' : 'Totals unavailable.'}</span>}
        {quote && catalogue.status === 'ready' ? <Btn to="/checkout" className="mt-1.5">CHECK OUT</Btn> : <Btn disabled className="mt-1.5">CHECK OUT</Btn>}
        <span className="text-center text-[12.5px] text-muted">Prices exclude GST, which is added above. Ships across India.</span>
      </aside>
    </div>
  );
}
