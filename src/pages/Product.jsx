import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fmt, grades } from '../data';
import { useStore, MAX_QTY } from '../store';
import { Photo, Badge, ProductCard, Skeleton, ErrorBox, Btn, Label, H1, H2, PX, cx } from '../components/ui';
import NotFound from './NotFound';

const Fold = ({ title, children }) => (
  <details className="group border-b border-line text-[14.5px]">
    <summary className="flex cursor-pointer list-none justify-between py-[15px] [&::-webkit-details-marker]:hidden">{title}<span className="text-maroon transition-transform group-open:rotate-45">+</span></summary>
    <p className="pb-4">{children}</p>
  </details>
);

export default function Product() {
  const { id } = useParams();
  const { catalogue, loadCatalogue, byId, add } = useStore();
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  useEffect(() => { setSize(0); setQty(1); }, [id]);
  if (catalogue.status === 'loading') return <div className="pt-12"><Skeleton n={3} /></div>;
  if (catalogue.status === 'error') return <div className={cx('py-12', PX)}><ErrorBox retry={loadCatalogue}>{catalogue.error}</ErrorBox></div>;
  const p = byId(id);
  if (!p) return <NotFound />;
  const s = p.sizes[size] || p.sizes[0];
  const isSaffron = p.category === 'Saffron';
  const more = catalogue.products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  return (
    <>
      <div className={cx('pt-5 text-[12.5px] text-muted', PX)}><Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(p.room)}`}>{p.room}</Link> / <span className="text-ink">{p.name}</span></div>
      <div className={cx('grid gap-14 pb-16 pt-6 lg:grid-cols-[1.1fr_1fr]', PX)}>
        <div className="p-2"><div className="aspect-[4/5] overflow-hidden rounded-t-[240px] outline outline-1 outline-offset-8 outline-gold"><Photo src={p.img} label={p.name} /></div></div>
        <div className="flex flex-col gap-[22px] pt-3">
          <div className="flex flex-wrap items-center gap-2.5"><Badge color={p.color}>{p.category}</Badge>{!p.available && <span className="text-[12.5px] font-medium text-kesar">Sold out</span>}</div>
          <H1 className="text-[clamp(44px,5vw,58px)]">{p.name}</H1>
          {p.desc && <p className="text-[15.5px] font-light leading-[1.65]">{p.desc}</p>}
          <div className="text-[13px] text-muted">Price excludes GST; GST is added at checkout.</div>
          {p.sized && (
            <fieldset className="flex flex-col gap-2.5">
              <legend className="mb-2.5 font-cinzel text-[11px] uppercase tracking-[.28em] text-gold">Pack size</legend>
              <div className="flex flex-wrap gap-2.5">{p.sizes.map((z, i) => (
                <button key={z.id} type="button" aria-pressed={i === size} onClick={() => setSize(i)} className={cx('flex min-w-[110px] flex-col items-start gap-0.5 border border-maroon px-5 py-3 text-sm', i === size ? 'bg-maroon text-ivory' : 'text-maroon')}><b className="font-medium">{z.label}</b><span className="text-xs opacity-80">{fmt(z.price)}</span></button>
              ))}</div>
            </fieldset>
          )}
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center border border-maroon">
              <button type="button" aria-label="Less" className="h-[52px] w-11 text-xl text-maroon" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><span className="w-8 text-center font-medium" aria-live="polite">{qty}</span><button type="button" aria-label="More" className="h-[52px] w-11 text-xl text-maroon" onClick={() => setQty(q => Math.min(MAX_QTY, q + 1))}>+</button>
            </div>
            <Btn className="flex-1" disabled={!p.available} onClick={() => add(p, s, qty)}>{p.available ? `ADD TO BAG · ${fmt(s.price * qty)}` : 'SOLD OUT'}</Btn>
          </div>
          <div className="border-t border-line">
            <Fold title="How to use">{isSaffron ? 'Steep 3–4 threads in warm milk or water for ten minutes before adding to kahwa, phirni or biryani.' : 'Eat as is, or use in cooking, baking and gifting. Pairs well with kahwa.'}</Fold>
            <Fold title="Storage">Keep sealed in a cool, dry place away from sunlight.</Fold>
            <Fold title="Shipping">Ships anywhere in India, usually within a few days. Delivery timing is confirmed at checkout.</Fold>
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
      {more.length > 0 && (
        <section className={cx('py-16', PX)}><H2 className="mb-8 text-[40px]">More from {p.category}</H2><div className="grid gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">{more.map(m => <ProductCard key={m.id} p={m} />)}</div></section>
      )}
    </>
  );
}
