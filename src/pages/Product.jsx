import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { byId, imgSrc, fmt, grades, FREE_SHIP, products } from '../data';
import { useStore } from '../store';
import { Photo, Badge, ProductCard, Btn, Label, H1, H2, PX, cx } from '../components/ui';
import NotFound from './NotFound';

const Fold = ({ title, children }) => (
  <details className="group border-b border-line text-[14.5px]">
    <summary className="flex cursor-pointer list-none justify-between py-[15px] [&::-webkit-details-marker]:hidden">{title}<span className="text-maroon transition-transform group-open:rotate-45">+</span></summary>
    <p className="pb-4">{children}</p>
  </details>
);

export default function Product() {
  const { id } = useParams();
  const p = byId(id);
  const { add } = useStore();
  const nav = useNavigate();
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  if (!p) return <NotFound />;
  const [unit, price] = p.sizes[size];
  const isSaffron = p.id === 'saf';
  const item = () => ({ key: `${p.id}|${unit}`, kind: 'item', id: p.id, name: p.name, sub: unit + (isSaffron ? ' · Lot KM-PMP-2611' : ''), grade: p.grade, color: p.color, img: imgSrc(p), price, qty });
  const more = products.filter(x => x.id !== p.id && x.room === p.room).slice(0, 4);
  const lot = (l, v, mono) => <div><Label className="mb-1 block text-[10px] text-gold">{l}</Label><div className={mono ? 'font-mono text-[13px] font-medium' : ''}>{v}</div></div>;
  return (
    <>
      <div className={cx('pt-5 text-[12.5px] text-muted', PX)}><Link to="/shop">Shop</Link> / <Link to={`/shop?room=${p.room}`}>{p.room}</Link> / <span className="text-ink">{p.name}</span></div>
      <div className={cx('grid gap-14 pb-16 pt-6 lg:grid-cols-[1.1fr_1fr]', PX)}>
        <div className="p-2"><div className="aspect-[4/5] overflow-hidden rounded-t-[240px] outline outline-1 outline-offset-8 outline-gold"><Photo src={imgSrc(p)} label={p.name} /></div></div>
        <div className="flex flex-col gap-[22px] pt-3">
          <div className="flex flex-wrap items-center gap-2.5"><Badge color={p.color}>{p.grade}{isSaffron ? ' · Finest' : ''}</Badge>{p.iso && <span className="text-[12.5px] text-muted">{p.iso}</span>}</div>
          <div><H1 className="text-[clamp(44px,5vw,58px)]">{p.name}</H1><p className="mt-2 font-display text-[21px] italic text-pine">{p.tagline || p.sub}</p></div>
          {p.desc && <p className="text-[15.5px] font-light leading-[1.65]">{p.desc}</p>}
          <div className="flex flex-col gap-2.5">
            <Label className="text-gold">{isSaffron ? 'Weight' : 'Size'}</Label>
            <div className="flex flex-wrap gap-2.5">{p.sizes.map(([u, pr], i) => (
              <button key={u} onClick={() => setSize(i)} className={cx('flex min-w-[110px] flex-col items-start gap-0.5 border border-maroon px-5 py-3 text-sm', i === size ? 'bg-maroon text-ivory' : 'text-maroon')}><b className="font-medium">{u}</b><span className="text-xs opacity-80">{fmt(pr)}</span></button>
            ))}</div>
          </div>
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center border border-maroon">
              <button className="h-[52px] w-11 text-xl text-maroon" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><span className="w-8 text-center font-medium">{qty}</span><button className="h-[52px] w-11 text-xl text-maroon" onClick={() => setQty(q => Math.min(9, q + 1))}>+</button>
            </div>
            <Btn className="flex-1" onClick={() => add(item())}>ADD TO BAG · {fmt(price * qty)}</Btn>
            <Btn ghost onClick={() => nav('/gift')}>GIFT IT</Btn>
          </div>
          {isSaffron && <div className="grid gap-3.5 border border-line bg-ivory px-5 py-[18px] text-sm min-[480px]:grid-cols-3">{lot('Lot', 'KM-PMP-2611', true)}{lot('Picked', '12 Oct 2026')}{lot('Grower', 'Bhat family, Pampore')}</div>}
          <div className="border-t border-line">
            <Fold title="How to use">{isSaffron ? 'Steep 3–4 threads in warm milk or water for ten minutes before adding to kahwa, phirni or biryani.' : 'Eat as is, or use in cooking, baking and gifting. Pairs well with kahwa.'}</Fold>
            <Fold title="Lab report & storage">Keep sealed in a cool, dry place away from sunlight. Each lot is lab-tested; trace your lot from the back of the pack.</Fold>
            <Fold title={`Shipping · 3–5 days, free above ${fmt(FREE_SHIP)}`}>Ships from Srinagar in 3–5 days. Express (1–2 days) available at checkout.</Fold>
          </div>
        </div>
      </div>

      {isSaffron && (
        <section className={cx('border-t border-line bg-ivory py-14', PX)}>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-2"><H2 className="text-[40px]">Know your kesar</H2><span className="text-[13.5px] text-muted">How much of the thread is kept decides the grade.</span></div>
          <div className="grid border border-line md:grid-cols-3">
            {grades.map((g, i) => (
              <div key={g.name} className={cx('flex flex-col gap-3 border-b border-line p-7 last:border-0 md:border-b-0 md:border-r md:last:border-r-0', i === 0 && 'bg-[#FBF6EE]')}>
                <div className="flex items-baseline justify-between"><span className="font-display text-[32px] font-medium text-maroon">{g.name}</span><Label className="text-[10.5px] text-kesar">{g.tag}</Label></div>
                <div className="h-[5px] bg-line2"><div className="h-full bg-kesar" style={{ width: g.bar }} /></div>
                <p className="text-[14.5px] leading-[1.6]">{g.d}</p><span className="text-[13px] text-muted">{g.use}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {more.length > 0 && !isSaffron && (
        <section className={cx('py-16', PX)}><H2 className="mb-8 text-[40px]">Also from the {p.room} room</H2><div className="grid gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">{more.map(m => <ProductCard key={m.id} p={m} />)}</div></section>
      )}
    </>
  );
}
