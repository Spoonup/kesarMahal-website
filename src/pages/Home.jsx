import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { lots, categoriesOf, isBox } from '../data';
import { ProductCard, Skeleton, ErrorBox, Photo, SectionHead, Btn, ULink, Eyebrow, H2, Diamond, Arch, PX, cx } from '../components/ui';
import usePageMeta from '../usePageMeta';

const steps = [
  ['I', 'Choose your treasures', 'Saffron, dry fruits, honey and kahwa from the Kesar Mahal pantry.'],
  ['II', 'See the price first', 'Prices are quoted by our server, before GST. GST is added at checkout, and we charge no delivery fee.'],
  ['III', 'Shipped across India', 'Pantry orders ship within days. Your order page shows the expected ship date and its status.']
];

// Demo only (one sample lot, see docs/GAPS.md F-P1-7). Not rendered anywhere until lots come from the backend.
export function LotTrace() {
  const [code, setCode] = useState('');
  const [res, setRes] = useState(null);
  return (
    <div>
      <form className="flex max-w-[420px] border-b border-gold2" onSubmit={e => { e.preventDefault(); setRes(lots[code.trim().toUpperCase()] || 'none'); }}>
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="KM-PMP-____" aria-label="Lot number" className="w-full bg-transparent py-3 font-mono text-[15px] text-gold2 placeholder:text-gold2/60" />
        <button className="font-cinzel text-[11px] uppercase tracking-[.24em] text-ivory">Trace</button>
      </form>
      {res === 'none' && <p className="mt-2.5 text-[13px]">We couldn’t find that lot. Check the code on the back of the pack.</p>}
      {res && res !== 'none' && <p className="mt-2.5 text-[13px]">{res.product} · picked {res.picked} · {res.grower}</p>}
    </div>
  );
}

const Trust = () => (
  <div className={cx('flex flex-wrap justify-between gap-3 border-y border-line bg-ivory py-[18px] font-cinzel text-[11.5px] uppercase tracking-[.22em] text-pine', PX)}>
    <span>Kashmiri saffron &amp; dry fruits</span><span>Shipped across India</span><span>GST shown at checkout</span><span>A Spoonup house</span>
  </div>
);

export default function Home() {
  usePageMeta(null, 'Kashmiri saffron, almonds, walnuts, honey and kahwa, shipped across India.');
  const { catalogue, loadCatalogue } = useStore();
  const products = catalogue.products.filter(p => !isBox(p));
  const best = products.filter(p => p.available).slice(0, 4);
  const cats = categoriesOf(products).slice(0, 4).map(c => ({ name: c, p: products.find(p => p.room === c), n: products.filter(p => p.room === c).length }));
  return (
    <>
      <section className={cx('grid items-center gap-14 pb-[72px] pt-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16', PX)}>
        <div className="flex flex-col gap-[26px]">
          <Eyebrow>Saffron · Dry fruits · Kahwa</Eyebrow>
          <h1 className="font-display text-[clamp(44px,6vw,78px)] font-medium leading-none text-maroon">Treasures from Kashmir, brought home with ceremony.</h1>
          <p className="max-w-[480px] text-[17px] font-light leading-[1.65]">Kashmiri saffron, almonds, walnuts, honey and kahwa, delivered across India.</p>
          <div className="flex flex-wrap gap-3.5"><Btn to="/shop">SHOP THE HARVEST</Btn></div>
        </div>
        <Arch><img src="/assets/km-logo.jpg" width="1254" height="1254" decoding="async" alt="Kesar Mahal logo: Kashmiri mountains and lake framed by an arch, with saffron, almonds and walnuts" className="size-full object-cover" /></Arch>
      </section>

      <Trust />

      {cats.length > 0 && (
        <section className={cx('py-16', PX)}>
          <SectionHead eyebrow="The pantry" title="Shelves of the house" />
          <div className="grid grid-cols-1 gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">
            {cats.map(r => (
              <Link key={r.name} to={`/shop?category=${encodeURIComponent(r.name)}`} className="flex flex-col gap-3">
                <div className="aspect-[3/4] rounded-t-[150px] border border-line bg-ivory p-[7px]"><div className="size-full overflow-hidden rounded-t-[143px]"><Photo src={r.p?.img} label={r.name} /></div></div>
                <div className="flex items-center gap-2.5 font-display text-[25px] font-medium"><Diamond color={r.p?.color} />{r.name}</div>
                <span className="-mt-1.5 text-[13.5px] font-light">{r.n} {r.n === 1 ? 'product' : 'products'}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={cx('pb-20', PX)}>
        <SectionHead eyebrow="From the shelf" title="From the pantry" right={<ULink to="/shop">VIEW ALL {products.length || ''}</ULink>} />
        {catalogue.status === 'loading' ? <Skeleton n={4} className="" /> : catalogue.status === 'error' ? <ErrorBox retry={loadCatalogue}>{catalogue.error}</ErrorBox>
          : <div className="grid grid-cols-1 gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">{best.map(p => <ProductCard key={p.id} p={p} />)}</div>}
      </section>

      <section className={cx('jaali grid items-center gap-14 py-[88px] text-ivory lg:grid-cols-2', PX)}>
        <div className="flex flex-col gap-5 bg-maroon py-1.5">
          <Eyebrow className="text-gold2">How it works</Eyebrow>
          <H2 className="text-[clamp(32px,4vw,52px)] text-ivory">From the pantry to your door.</H2>
          <p className="text-base font-light leading-[1.65] text-[#EADFD0]">A simple, clearly priced order, shipped anywhere in India.</p>
        </div>
        <div className="flex flex-col bg-maroon">
          {steps.map(([n, t, d]) => (
            <div key={n} className="grid grid-cols-[60px_1fr] gap-3.5 border-t border-gold2/50 py-[22px]">
              <span className="font-cinzel text-[26px] text-gold2">{n}</span>
              <div><h3 className="mb-1 font-display text-[25px] font-medium text-ivory">{t}</h3><p className="text-[14.5px] leading-[1.6] text-[#EADFD0]">{d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
