import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { boxes, colours, treasures, byId, fmt, imgSrc } from '../data';
import { useStore } from '../store';
import { Photo, Btn, Label, Eyebrow, H1, Lines, Line, PX, cx } from '../components/ui';

const Step = ({ n, title, right, children }) => (
  <div className="flex flex-col gap-3.5">
    <div className="flex items-baseline justify-between"><Label className="text-gold">{n} · {title}</Label>{right}</div>
    {children}
  </div>
);
const opt = on => cx('flex flex-col gap-1.5 border bg-ivory p-[18px] text-left', on ? 'border-[1.5px] border-maroon bg-[#FBF6EE] p-[17.5px]' : 'border-line');

export default function Gift() {
  const { state: prev } = useLocation();   // set when editing a box from the bag
  const { add } = useStore();
  const nav = useNavigate();
  const [bi, setBi] = useState(prev?.bi ?? 1);
  const [ci, setCi] = useState(prev?.ci ?? 0);
  const [picks, setPicks] = useState(prev?.picks ?? ['alm', 'kkh', 'wal', 'fig']);
  const [note, setNote] = useState(prev?.note ?? '');
  const box = boxes[bi], colour = colours[ci];
  const chosen = picks.slice(0, box.n).map(id => byId(id));
  const full = chosen.length === box.n;
  const total = chosen.reduce((a, t) => a + t.gift[1], 0) + box.price;
  const toggle = id => setPicks(cur => {
    const c = cur.slice(0, box.n);
    return c.includes(id) ? c.filter(x => x !== id) : c.length >= box.n ? c : [...c, id];
  });
  const addBox = () => {
    add({ key: 'gift|' + Date.now(), kind: 'gift', name: `The ${box.name} · ${colour.name}`, sub: chosen.map(t => t.name).join(', ') + (note ? ' · note added' : ''),
      grade: 'Gift box', color: '#8A5E9C', price: total, qty: 1, gift: { bi, ci, picks: chosen.map(t => t.id), note } });
    nav('/bag');
  };
  return (
    <div className="grid items-start lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className={cx('flex flex-col gap-10 py-12 lg:pr-12', PX)}>
        <div className="flex flex-col gap-2.5"><Eyebrow className="text-crocus">Build a gift box</Eyebrow><H1 className="text-[clamp(36px,4.4vw,54px)]">Packed the way it would be in Srinagar</H1></div>
        <Step n="I" title="Choose a box">
          <div className="grid gap-3.5 min-[480px]:grid-cols-3">{boxes.map((b, i) => (
            <button key={b.name} className={opt(i === bi)} onClick={() => { setBi(i); setPicks(p => p.slice(0, b.n)); }}>
              <b className="font-display text-2xl font-medium text-maroon">{b.name}</b><span className="text-[13px] text-muted">{b.n} treasures</span><span className="mt-1.5 text-sm font-medium">Box {fmt(b.price)}</span>
            </button>))}
          </div>
        </Step>
        <Step n="II" title="Fill it" right={<span className="text-[13px] text-muted">{chosen.length} of {box.n} chosen</span>}>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">{treasures.map(t => {
            const on = chosen.some(c => c.id === t.id);
            return (
              <button key={t.id} onClick={() => toggle(t.id)} className={cx('flex flex-col border bg-ivory text-left', on ? 'border-[1.5px] border-maroon' : 'border-line', !on && full && 'opacity-50')}>
                <div className="pointer-events-none relative aspect-square"><Photo src={imgSrc(t)} label={t.name} />
                  <span className={cx('absolute right-2 top-2 flex size-6 items-center justify-center rounded-full border border-maroon text-[13px] text-ivory', on ? 'bg-maroon' : 'bg-ivory')}>{on && '✓'}</span></div>
                <div className="flex flex-col px-3 py-2.5"><b className="font-display text-[18px] font-medium leading-[1.1] text-maroon">{t.name}</b><span className="text-xs text-muted">{t.gift[0]} · {fmt(t.gift[1])}</span></div>
              </button>);
          })}</div>
        </Step>
        <div className="grid gap-7 md:grid-cols-[1fr_1.4fr]">
          <Step n="III" title="Box colour">
            <div className="flex flex-wrap gap-3">{colours.map((c, i) => (
              <button key={c.name} onClick={() => setCi(i)} className={cx(opt(i === ci), 'flex-row items-center gap-2.5 text-sm')}><span className="size-[22px] border border-gold" style={{ background: c.hex }} />{c.name}</button>))}
            </div>
          </Step>
          <Step n="IV" title="Your note">
            <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={200} placeholder="Eid Mubarak, Ammi. From the valley, with love."
              className="h-[86px] resize-none border border-line bg-ivory p-3.5 font-display text-[19px] italic leading-[1.4] text-maroon focus:border-maroon" />
          </Step>
        </div>
      </div>
      <aside className="flex flex-col gap-5 self-stretch border-t border-line bg-ivory px-6 py-10 lg:border-l lg:border-t-0 lg:px-8">
        <Label className="text-gold">Your box</Label>
        <div className="jaali p-[18px]" style={{ backgroundColor: colour.hex }}>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: box.n }, (_, i) => (
              <div key={i} className="flex aspect-square items-center justify-center border border-dashed border-gold p-1.5 text-center font-display text-[13px] font-medium leading-[1.1] text-maroon" style={{ background: chosen[i] ? '#F5F1EA' : 'rgba(245,241,234,.25)' }}>{chosen[i]?.name}</div>
            ))}
          </div>
        </div>
        <div className="font-display text-[26px] font-medium text-maroon">The {box.name} · {colour.name}</div>
        <Lines>
          {chosen.map(t => <Line key={t.id}><span className="font-light">{t.name}</span><span>{fmt(t.gift[1])}</span></Line>)}
          <Line><span className="font-light">Box, tissue &amp; seal</span><span>{fmt(box.price)}</span></Line>
          <Line total><span>Total</span><span>{fmt(total)}</span></Line>
        </Lines>
        <Btn disabled={!full} onClick={addBox}>{full ? 'ADD BOX TO BAG' : `CHOOSE ${box.n - chosen.length} MORE`}</Btn>
        <span className="text-[12.5px] leading-normal text-muted">Free shipping on gift boxes above ₹2,000. Prices are never printed inside the box.</span>
      </aside>
    </div>
  );
}
