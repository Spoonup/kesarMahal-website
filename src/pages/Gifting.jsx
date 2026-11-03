import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, useQuote } from '../store';
import { BOXES, BOX_COLOURS, NOTE_MAX, boxProductOf, treasuresOf, fmt } from '../data';
import { Photo, Btn, Label, Eyebrow, H1, Lines, Line, Skeleton, ErrorBox, PX, cx } from '../components/ui';

const Step = ({ n, title, right, children }) => (
  <div className="flex flex-col gap-3.5">
    <div className="flex items-baseline justify-between"><Label className="text-gold">{n} · {title}</Label>{right}</div>
    {children}
  </div>
);
const opt = on => cx('flex flex-col gap-1.5 border bg-ivory p-3 text-left sm:p-[18px]', on ? 'border-[1.5px] border-maroon bg-[#FBF6EE] p-[11.5px] sm:p-[17.5px]' : 'border-line');
const sizesOf = p => p.sizes.filter(z => z.price > 0);

export default function Gifting() {
  const { catalogue, loadCatalogue, addGift } = useStore();
  const [tierKey, setTierKey] = useState('Chinar');
  const [picks, setPicks] = useState([]);          // product ids, in order chosen
  const [sizeOf, setSizeOf] = useState({});         // product id -> chosen size id
  const [ci, setCi] = useState(0);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);
  const lock = useRef(false);

  const live = catalogue.products;
  const boxes = BOXES.map(b => ({ ...b, item: boxProductOf(live, b) }));
  const box = boxes.find(b => b.key === tierKey && b.item) || boxes.find(b => b.item) || boxes.find(b => b.key === tierKey);
  const colour = BOX_COLOURS[ci];
  const treasures = useMemo(() => treasuresOf(live), [live]);
  const sizeFor = p => sizesOf(p).find(z => z.id === sizeOf[p.id]) || sizesOf(p)[0];
  const chosen = picks.slice(0, box.n).map(id => treasures.find(t => t.id === id)).filter(Boolean);
  const full = chosen.length === box.n;
  const ready = Boolean(box.item) && full;

  // Re-arm the button whenever the box changes after adding.
  useEffect(() => { lock.current = false; setAdded(false); }, [box.key, picks, sizeOf, ci, note]);

  const items = ready ? [{ p: box.item, size: box.item.sizes[0] }, ...chosen.map(p => ({ p, size: sizeFor(p) }))] : [];
  const wouldBe = useMemo(() => items.map(({ p, size }) => ({ productId: p.id, sizeId: size.id, qty: 1 })), [items.map(i => i.p.id + i.size.id).join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const { status, quote } = useQuote(undefined, undefined, wouldBe);
  const q = quote?.lines.length === items.length ? quote : null;

  const toggle = id => setPicks(cur => {
    const c = cur.slice(0, box.n);
    return c.includes(id) ? c.filter(x => x !== id) : c.length >= box.n ? c : [...c, id];
  });
  const pickTier = b => { setTierKey(b.key); setPicks(p => p.slice(0, b.n)); };
  const add = () => {
    if (lock.current || !q) return;
    lock.current = true;
    if (addGift({ tier: box.key, colour: colour.name, note: note.trim() }, items)) setAdded(true); else lock.current = false;
  };

  return (
    <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className={cx('flex flex-col gap-10 py-12 lg:pr-12', PX)}>
        <div className="flex flex-col gap-2.5"><Eyebrow className="text-crocus">Build a gift box</Eyebrow><H1 className="text-[clamp(36px,4.4vw,54px)]">Packed the way it would be in Srinagar</H1></div>
        {catalogue.status === 'loading' ? <Skeleton n={3} className="" /> : catalogue.status === 'error' ? <ErrorBox retry={loadCatalogue}>{catalogue.error || 'Could not load the pantry.'}</ErrorBox> : <>
          <Step n="I" title="Choose a box">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">{boxes.map(b => b.item ? (
              <button key={b.key} type="button" aria-pressed={b.key === box.key} className={opt(b.key === box.key)} onClick={() => pickTier(b)}>
                <b className="font-display text-2xl font-medium text-maroon">{b.key}</b><span className="text-[13px] text-muted">{b.n} treasures</span><span className="mt-1.5 text-sm font-medium">Box {fmt(b.item.sizes[0].price)}</span>
              </button>) : (
              <div key={b.key} aria-disabled="true" className={cx(opt(false), 'jaali-light border-dashed opacity-80')}>
                <b className="font-display text-2xl font-medium text-maroon">{b.key}</b><span className="text-[13px] text-muted">{b.n} treasures</span><Label className="mt-1.5 text-gold">Unavailable</Label>
              </div>))}
            </div>
            {!boxes.some(b => b.item) && <p className="text-[13px] text-muted">Gift boxes are not on sale yet, so a box cannot be added to the bag. For a custom gift, <Link to="/contact" className="border-b border-maroon text-maroon">contact us</Link>.</p>}
          </Step>
          <Step n="II" title="Fill it" right={<span className="text-[13px] text-muted">{chosen.length} of {box.n} chosen</span>}>
            <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-4">{treasures.map(p => {
              const on = chosen.includes(p), sz = sizeFor(p), many = sizesOf(p).length > 1;
              return (
                <div key={p.id} className={cx('flex flex-col border bg-ivory', on ? 'border-[1.5px] border-maroon' : 'border-line', !on && full && 'opacity-50')}>
                  <button type="button" aria-pressed={on} onClick={() => toggle(p.id)} className="relative block aspect-square overflow-hidden text-left" aria-label={`${on ? 'Remove' : 'Choose'} ${p.name}`}>
                    <Photo src={p.img} label={p.name} />
                    <span className={cx('absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border border-maroon text-[13px] text-ivory', on ? 'bg-maroon' : 'bg-ivory')}>{on && '✓'}</span>
                  </button>
                  <div className="flex flex-col px-3 py-2.5"><b className="font-display text-[18px] font-medium leading-[1.1] text-maroon">{p.name}</b>
                    {many ? (
                      <select aria-label={`Pack size for ${p.name}`} value={sz.id} onChange={e => setSizeOf(s => ({ ...s, [p.id]: e.target.value }))} className="-ml-1 mt-1 w-full bg-transparent text-xs text-muted">
                        {sizesOf(p).map(z => <option key={z.id} value={z.id}>{z.label} · {fmt(z.price)}</option>)}
                      </select>
                    ) : <span className="text-xs text-muted">{[sz.label, fmt(sz.price)].filter(Boolean).join(' · ')}</span>}
                  </div>
                </div>);
            })}</div>
          </Step>
          <div className="grid gap-7 md:grid-cols-[1fr_1.4fr]">
            <Step n="III" title="Box colour">
              <div className="flex flex-wrap gap-3">{BOX_COLOURS.map((c, i) => (
                <button key={c.name} type="button" aria-pressed={i === ci} onClick={() => setCi(i)} className={cx(opt(i === ci), 'flex-row items-center gap-2.5 text-sm')}><span className="size-[22px] border border-gold" style={{ background: c.hex }} />{c.name}</button>))}
              </div>
            </Step>
            <Step n="IV" title="Your note" right={<span className="text-[12px] text-muted">{note.length}/{NOTE_MAX}</span>}>
              <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={NOTE_MAX} aria-label="Gift note" placeholder="Eid Mubarak, Ammi. From the valley, with love."
                className="h-[86px] resize-none border border-line bg-ivory p-3.5 font-display text-[19px] italic leading-[1.4] text-maroon focus:border-maroon" />
            </Step>
          </div>
        </>}
        <p className="text-[14px] font-light">Need a custom gift or bulk order? <Link to="/contact" className="border-b border-maroon text-maroon">Contact us</Link></p>
      </div>
      <aside className="flex flex-col gap-5 border-t border-line bg-ivory px-6 py-10 lg:sticky lg:top-0 lg:self-start lg:border-l lg:border-t-0 lg:px-8" aria-busy={status === 'loading'}>
        <Label className="text-gold">Your box</Label>
        <div className="jaali p-[18px]" style={{ backgroundColor: colour.hex }}>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: box.n }, (_, i) => (
              <div key={i} className="flex aspect-square items-center justify-center border border-dashed border-gold p-1.5 text-center font-display text-[13px] font-medium leading-[1.1] text-maroon" style={{ background: chosen[i] ? '#F5F1EA' : 'rgba(245,241,234,.25)' }}>{chosen[i]?.name}</div>
            ))}
          </div>
        </div>
        <div className="font-display text-[26px] font-medium text-maroon">The {box.key} · {colour.name}</div>
        <Lines>
          {chosen.map((t, i) => <Line key={t.id}><span className="font-light">{t.name}, {sizeFor(t).label}</span><span>{q ? fmt(q.lines[i + 1].baseAmount) : '—'}</span></Line>)}
          <Line><span className="font-light">Box, tissue &amp; seal</span><span>{q ? fmt(q.lines[0].baseAmount) : '—'}</span></Line>
          {q && <Line><span className="font-light">GST</span><span>{fmt(q.totals.taxTotal)}</span></Line>}
          <Line total><span>Total</span><span>{q ? fmt(q.totals.calculatedTotal) : '—'}</span></Line>
        </Lines>
        {added ? <Btn to="/bag">VIEW BAG</Btn> : <Btn disabled={!q} onClick={add}>{!box.item ? 'BOX UNAVAILABLE' : !full ? `CHOOSE ${box.n - chosen.length} MORE` : status === 'loading' ? 'PRICING…' : 'ADD BOX TO BAG'}</Btn>}
        <span className="text-[12.5px] leading-normal text-muted">{!box.item ? 'Gift boxes are unavailable right now. ' : ''}Prices exclude GST, which is added above. Prices are never printed inside the box.</span>
      </aside>
    </div>
  );
}
