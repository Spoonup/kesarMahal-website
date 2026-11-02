import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products, rooms, lots } from '../data';
import { ProductCard, Photo, SectionHead, Btn, ULink, Eyebrow, H2, Diamond, Arch, PX, cx } from '../components/ui';

const steps = [
  ['I', 'Picked at origin', 'Bought directly from orchard families across Budgam, Kulgam and Pampore. No mandi middlemen.'],
  ['II', 'Graded by hand', 'Each lot is sorted for size, colour and oil content at our Srinagar packhouse.'],
  ['III', 'Sealed & traced', 'Nitrogen-flushed, lot-numbered, and shipped within days of grading.']
];

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
    <span>Direct from growers</span><span>Hand graded</span><span>Lab-tested saffron</span><span>Sealed in Srinagar</span>
  </div>
);

export default function Home() {
  const best = ['alm', 'wal', 'mix', 'hny'].map(id => products.find(p => p.id === id));
  return (
    <>
      <section className={cx('grid items-center gap-14 pb-[72px] pt-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16', PX)}>
        <div className="flex flex-col gap-[26px]">
          <Eyebrow>Autumn harvest · 2026</Eyebrow>
          <h1 className="font-display text-[clamp(44px,6vw,78px)] font-medium leading-none text-maroon">Treasures from Kashmir, brought home with ceremony.</h1>
          <p className="max-w-[480px] text-[17px] font-light leading-[1.65]">Almonds from Budgam, walnuts from Kulgam, saffron from Pampore. Bought from growers we know by name, graded by hand, sealed in Srinagar.</p>
          <div className="flex flex-wrap gap-3.5"><Btn to="/shop">SHOP THE HARVEST</Btn><Btn to="/gift" ghost>BUILD A GIFT BOX</Btn></div>
        </div>
        <Arch><img src="/assets/km-logo.jpg" alt="Kesar Mahal crest" className="size-full object-cover" /></Arch>
      </section>

      <Trust />

      <section className={cx('py-16', PX)}>
        <SectionHead eyebrow="The pantry" title="Four rooms of the house" />
        <div className="grid grid-cols-1 gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">
          {rooms.map(r => (
            <Link key={r.id} to={r.to} className="flex flex-col gap-3">
              <div className="aspect-[3/4] rounded-t-[150px] border border-line bg-ivory p-[7px]"><div className="size-full overflow-hidden rounded-t-[143px]"><Photo src={r.img} label={r.name} /></div></div>
              <div className="flex items-center gap-2.5 font-display text-[25px] font-medium"><Diamond color={r.color} />{r.name}</div>
              <span className="-mt-1.5 text-[13.5px] font-light">{r.line}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={cx('pb-20', PX)}>
        <SectionHead eyebrow="Most gifted" title="From this season’s harvest" right={<ULink to="/shop">VIEW ALL {products.length}</ULink>} />
        <div className="grid grid-cols-1 gap-[22px] min-[480px]:grid-cols-2 lg:grid-cols-4">{best.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className={cx('jaali grid items-center gap-14 py-[88px] text-ivory lg:grid-cols-2', PX)}>
        <div className="flex flex-col gap-5 bg-maroon py-1.5">
          <Eyebrow className="text-gold2">Orchard to table</Eyebrow>
          <H2 className="text-[clamp(32px,4vw,52px)] text-ivory">We know the village, the family, and the week it was picked.</H2>
          <p className="text-base font-light leading-[1.65] text-[#EADFD0]">Every pack carries a lot number. Enter it to see where it grew, who graded it, and its lab report.</p>
          <LotTrace />
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

      <section className={cx('grid items-center gap-14 bg-ivory py-[88px] lg:grid-cols-2', PX)}>
        <div className="aspect-[5/4] outline outline-1 outline-offset-[10px] outline-gold"><Photo src="/assets/products/mix.png" label="Gift box" /></div>
        <div className="flex flex-col gap-5">
          <Eyebrow className="text-crocus">Gifting</Eyebrow>
          <H2 className="text-[clamp(32px,4vw,50px)]">A box packed the way it would be in Srinagar.</H2>
          <p className="text-base font-light leading-[1.65]">Choose three to six treasures and a box in maroon or ivory, then write a note. We wrap it in jaali tissue and seal it by hand.</p>
          <Btn to="/gift" className="self-start">BUILD YOUR BOX</Btn>
        </div>
      </section>

      <section className="flex flex-col items-center gap-5 px-5 py-[88px] text-center">
        <Diamond />
        <p className="max-w-[800px] font-display text-[clamp(24px,3vw,34px)] italic leading-[1.3] text-maroon">“The kahwa tasted like my nani’s kitchen in Rainawari. I’ve ordered the walnuts twice since.”</p>
        <span className="font-cinzel text-[11.5px] uppercase tracking-[.28em] text-pine">Farah M. · Bengaluru</span>
      </section>
    </>
  );
}
