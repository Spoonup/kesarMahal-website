import { useStore, useQuote } from '../store';
import { fmt, bagKey, BOXES } from '../data';
import { Photo, Badge, Qty, Btn, Label, H1, ErrorBox, TextBtn, PX, cx } from '../components/ui';
import { Totals, hasUnpriced, UNPRICED_MSG } from '../components/Summary';
import { friendly } from '../api';
import usePageMeta from '../usePageMeta';

export default function Bag() {
  usePageMeta('Your bag');
  const { lines, gifts, setQty, remove, removeGift, byId, catalogue } = useStore();
  const { status, quote, error } = useQuote();
  if (!lines.length) return (
    <div className="flex flex-col items-center gap-[18px] px-6 py-[120px] text-center"><H1>Your bag is empty.</H1><p>The pantry is waiting.</p><Btn to="/shop">SHOP THE HARVEST</Btn></div>
  );
  // The server returns quote lines in request order, so a line is priced by position (a product can sit in the bag twice: loose and in a box).
  const pricedAt = quote?.lines.length === lines.length ? quote.lines : [];
  const priced = new Map(lines.map((l, i) => [bagKey(l), pricedAt[i]]));
  const seen = new Set();
  const blocked = hasUnpriced(quote);
  return (
    <div className={cx('grid items-start gap-12 pb-[72px] pt-12 lg:grid-cols-[minmax(0,1fr)_400px]', PX)}>
      <div className="flex flex-col gap-6">
        <H1 className="text-[clamp(38px,4.4vw,54px)]">Your bag</H1>
        {error && <ErrorBox>{friendly(error)}</ErrorBox>}
        {blocked && <ErrorBox>{UNPRICED_MSG}</ErrorBox>}
        <div className="border-t border-line">
          {lines.map(l => {
            if (l.gift) {
              if (seen.has(l.gift)) return null;
              seen.add(l.gift);
              const g = gifts[l.gift], items = lines.filter(x => x.gift === l.gift), qs = items.map(x => priced.get(bagKey(x)));
              return (
                <div key={l.gift} className="flex flex-col gap-3 border-b border-line py-[22px]">
                  <div className="flex items-start justify-between gap-4">
                    <div><Badge color="#8A5E9C">Gift box</Badge><div className="mt-2 font-display text-[25px] font-medium text-maroon">The {g?.tier || 'Gift'} · {g?.colour}</div>
                      {g?.note && <div className="font-display text-[17px] italic text-muted">“{g.note}”</div>}
                      <TextBtn className="mt-1 text-[13px] text-muted" onClick={() => removeGift(l.gift)}>Remove box</TextBtn></div>
                    <span className="min-w-20 text-right text-[17px] font-medium">{qs.every(Boolean) ? fmt(qs.reduce((a, q) => a + q.baseAmount, 0)) : '…'}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-gold pl-4 text-[14.5px]">
                    {items.map((x, i) => (
                      <div key={bagKey(x)} className="flex justify-between gap-3"><span className="font-light">{BOXES.some(b => b.product === byId(x.productId)?.name) ? 'Box, tissue & seal' : [byId(x.productId)?.name, byId(x.productId)?.sizes.find(z => z.id === x.sizeId)?.label].filter(Boolean).join(', ')}</span><span>{qs[i] ? fmt(qs[i].baseAmount) : '…'}</span></div>
                    ))}
                  </div>
                </div>
              );
            }
            const key = bagKey(l);
            const p = byId(l.productId);
            const q = priced.get(key);
            const label = p?.sizes.find(s => s.id === l.sizeId)?.label;
            return (
              <div key={key} className="grid grid-cols-[80px_1fr_auto] items-center gap-x-3.5 gap-y-2 border-b border-line py-[22px] sm:grid-cols-[120px_minmax(0,1fr)_auto_auto] sm:gap-6">
                <div className="aspect-square overflow-hidden"><Photo src={p?.img} label={p?.name || ''} /></div>
                <div>{p && <Badge color={p.color}>{p.category}</Badge>}<div className="mt-2 font-display text-[25px] font-medium text-maroon">{p?.name || l.productId}</div>
                  <div className="text-[13px] text-muted">{[label, q && (q.baseAmount > 0 ? `${fmt(q.unitPrice)} each` : 'No price set')].filter(Boolean).join(' · ')}</div>
                  <TextBtn className="mt-1 text-[13px] text-muted" onClick={() => remove(key)}>Remove</TextBtn></div>
                <Qty value={l.qty} set={n => setQty(key, n)} label={[p?.name, label].filter(Boolean).join(', ')} />
                <span className="col-start-3 min-w-20 text-right text-[17px] font-medium sm:col-start-auto">{q ? fmt(q.baseAmount) : '…'}</span>
              </div>
            );
          })}
        </div>
      </div>
      <aside className="flex flex-col gap-3.5 border border-line bg-ivory p-7 text-[14.5px] lg:mt-[78px]" aria-busy={status === 'loading'}>
        <Label className="text-goldtext">Summary</Label>
        {quote ? <Totals quote={quote} /> : <span className="font-light text-muted">{status === 'loading' ? 'Pricing your bag…' : 'Totals unavailable.'}</span>}
        {quote && catalogue.status === 'ready' && !blocked ? <Btn to="/checkout" className="mt-1.5">CHECK OUT</Btn> : <Btn disabled className="mt-1.5">CHECK OUT</Btn>}
        <span className="text-center text-[12.5px] text-muted">Prices exclude GST, which is added above. Ships across India.</span>
      </aside>
    </div>
  );
}
