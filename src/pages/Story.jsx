import { Photo, Eyebrow, H1, PX, cx } from '../components/ui';

const cards = [['The karewas of Pampore', '', 'Pampore saffron'], ['Walnut orchards of Kulgam', '/assets/products/walnut.png', 'Kulgam walnuts'], ['Our Srinagar packhouse', '/assets/products/almond.png', 'Almonds']];

export default function Story() {
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
      <section className={cx('grid gap-16 py-20 md:grid-cols-2', PX)}>
        <p className="font-display text-[clamp(22px,2.4vw,30px)] leading-[1.35] text-maroon">Kesar Mahal began in the Spoonup kitchen, when our dry fruit kept running out faster than our granola. Customers wanted to know where it came from. So we went to find out.</p>
        <div className="flex flex-col gap-[18px] text-base font-light leading-[1.7]">
          <p>We now buy directly from orchard families in Budgam, Kulgam and Shopian, and from saffron growers on the karewas of Pampore. We pay on the day, not at the end of the season.</p>
          <p>Everything is graded and sealed at our packhouse in Srinagar, then shipped across India under the Spoonup name you already trust.</p>
          <em className="font-display text-[19px] text-gold">A Spoonup house</em>
        </div>
      </section>
      <section className={cx('grid gap-[22px] pb-20 min-[560px]:grid-cols-3', PX)}>
        {cards.map(([t, src, l]) => (
          <div key={t} className="flex flex-col gap-3"><div className="aspect-[4/5] overflow-hidden rounded-t-[180px]"><Photo src={src} label={l} /></div><span className="font-display text-[22px] font-medium text-maroon">{t}</span></div>
        ))}
      </section>
    </>
  );
}
