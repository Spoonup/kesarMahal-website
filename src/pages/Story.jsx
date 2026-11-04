import { Photo, Eyebrow, H1, H2, Btn, PX, cx } from '../components/ui';
import usePageMeta from '../usePageMeta';

const steps = [
  ['Source', 'We buy directly from orchard families in Budgam, Kulgam and Shopian, and from saffron growers on the karewas of Pampore. We pay on the day, not at the end of the season.'],
  ['Grade and seal', 'Everything is graded and sealed at our packhouse in Srinagar.'],
  ['Ship across India', 'From Srinagar to your door, wherever you are in India.'],
];
const cards = [
  ['The karewas of Pampore', '/assets/story/saffron-pampore.jpg', 'Saffron crocus flowers with red stigmas in a field at Pampore, Kashmir, in early morning light', 'Saffron from the growers of Pampore.'],
  ['Walnut orchards of Kulgam', '/assets/story/walnut-kulgam.jpg', 'Green walnuts on a branch in an orchard in Kulgam, Kashmir', 'Walnuts from the orchard families of Kulgam.'],
  ['Kashmiri almonds', '/assets/story/almond-valley.jpg', 'Almonds in a rustic wooden bowl beside an almond blossom branch, with a Kashmir valley behind', 'Almonds from the valley, graded in Srinagar.'],
];

export default function Story() {
  usePageMeta('Our story', 'How Kesar Mahal brings saffron, walnuts and almonds from the growers of Kashmir to your door.');
  return (
    <>
      <div className="relative h-[min(560px,70vh)]">
        <img src="/assets/story/dal-lake.jpg" width="1600" height="1600" loading="lazy" alt="Shikara boats on Dal Lake, Srinagar, at sunset with mountains behind" className="block size-full object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent to-60%" />
        <div className={cx('absolute inset-x-0 bottom-12 flex flex-col gap-4', PX)}>
          <Eyebrow className="text-gold2">Our story</Eyebrow>
          <H1 className="max-w-[880px] text-[clamp(40px,6vw,72px)] !text-ivory">A palace window onto the valley.</H1>
        </div>
      </div>

      <section className={cx('mx-auto flex max-w-[980px] flex-col items-center gap-8 py-20 text-center lg:py-28', PX)}>
        <i className="block h-px w-12 bg-gold" />
        <p className="font-display text-[clamp(28px,4vw,48px)] leading-[1.2] text-maroon">People kept asking where our dry fruit came from. So we went to the source.</p>
        <p className="max-w-[520px] text-base font-light leading-[1.7]">Kesar Mahal is what we found there: families who grow with care, and a way to bring their harvest to you without losing any of it on the road.</p>
      </section>

      <section className={cx('bg-maroon py-20 text-ivory lg:py-24', PX)}>
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow className="text-gold2">From orchard to doorstep</Eyebrow>
            <H2 className="!text-ivory">Three steps, kept simple.</H2>
          </div>
          <ol className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex flex-col gap-4 border-t border-gold/60 pt-6">
                <span className="font-cinzel text-[13px] tracking-[.32em] text-gold2">0{i + 1}</span>
                <h3 className="font-display text-[30px] font-medium leading-[1.1]">{t}</h3>
                <p className="font-light leading-[1.7] text-ivory/85">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={cx('mx-auto max-w-[1200px] py-20 lg:py-24', PX)}>
        <Eyebrow className="mb-8 block">Where it grows</Eyebrow>
        <div className="grid gap-10 min-[560px]:grid-cols-3 min-[560px]:gap-[22px]">
          {cards.map(([t, src, alt, cap]) => (
            <figure key={t} className="flex flex-col gap-3">
              <div className="aspect-[4/5] overflow-hidden rounded-t-[180px]"><Photo src={src} label={t} alt={alt} w={960} h={1200} /></div>
              <figcaption className="flex flex-col gap-2">
                <span className="font-display text-[22px] font-medium text-maroon">{t}</span>
                <i className="block h-px w-8 bg-gold" />
                <span className="text-[14.5px] font-light leading-[1.6]">{cap}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={cx('flex flex-col items-center gap-6 border-t border-gold/40 pb-20 pt-16 text-center', PX)}>
        <p className="max-w-[560px] font-display text-[clamp(24px,3vw,34px)] leading-[1.25] text-maroon">From the orchard to your door, with care at every step.</p>
        <Btn to="/shop">Shop the collection</Btn>
        <em className="font-display text-[19px] text-goldtext">A Spoonup house</em>
      </section>
    </>
  );
}
