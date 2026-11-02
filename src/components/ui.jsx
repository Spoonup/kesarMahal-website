import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { fmt } from '../data';

export const cx = (...a) => a.filter(Boolean).join(' ');
export const PX = 'px-6 lg:px-14';

export function Btn({ to, ghost, sm, className, ...p }) {
  const c = cx(
    'inline-block border border-maroon text-center tracking-[.14em] disabled:cursor-not-allowed disabled:border-[#9C8C80] disabled:bg-[#9C8C80] disabled:text-ivory',
    sm ? 'px-4 py-2.5 text-[11.5px]' : 'px-[30px] py-4 text-[13px]',
    ghost ? 'bg-transparent text-maroon hover:bg-maroon/10' : 'bg-maroon text-ivory hover:bg-[#561020]',
    className
  );
  return to ? <Link to={to} className={c} {...p} /> : <button className={c} {...p} />;
}

export const Label = ({ className, ...p }) => <span className={cx('font-cinzel text-[11px] uppercase tracking-[.28em]', className)} {...p} />;
export const Eyebrow = ({ className, ...p }) => <span className={cx('font-cinzel text-[11.5px] uppercase tracking-[.32em] text-gold', className)} {...p} />;
export const H1 = ({ className, ...p }) => <h1 className={cx('font-display text-[clamp(40px,5vw,58px)] leading-none font-medium text-maroon', className)} {...p} />;
export const H2 = ({ className, ...p }) => <h2 className={cx('font-display text-[clamp(30px,3.6vw,46px)] leading-[1.05] font-medium text-maroon', className)} {...p} />;
export const ULink = ({ to, className, ...p }) => <Link to={to} className={cx('border-b border-maroon pb-1 text-[13px] tracking-[.14em] text-maroon', className)} {...p} />;
export const TextBtn = ({ className, ...p }) => <button className={cx('hover:text-maroon', className)} {...p} />;
export const Diamond = ({ color = '#6B1426', className }) => <i className={cx('inline-block size-[9px] rotate-45', className)} style={{ background: color }} />;

export const Photo = ({ src, label, className, style }) =>
  src ? <img className={cx('block size-full object-cover', className)} src={src} alt={label} style={style} loading="lazy" />
      : <div className={cx('jaali-light flex size-full items-center justify-center p-3 text-center', className)} style={style}>
          <span className="border border-line bg-ivory px-3 py-1 font-display text-[22px] font-medium text-maroon">{label}</span>
        </div>;

export const Badge = ({ color, abs, children }) => (
  <span className={cx('inline-block px-2.5 py-1.5 font-cinzel text-[9.5px] uppercase tracking-[.22em]', abs && 'absolute left-3 top-3')}
    style={{ background: color, color: color === '#B08D57' ? '#2A1E1A' : '#F5F1EA' }}>{children}</span>
);

/* Cusped-arch frame from the logo: maroon outline, gold inline. */
export const Arch = ({ className, gold2, children }) => (
  <div className={cx('aspect-[520/572] w-full max-w-[520px] justify-self-center rounded-t-[260px] border-[1.5px] p-[9px]',
    gold2 ? 'border-gold2' : 'border-maroon bg-ivory shadow-[0_30px_60px_-30px_rgba(42,30,26,.45)]', className)}>
    <div className={cx('size-full rounded-t-[251px] border p-1.5', gold2 ? 'border-0 p-0' : 'border-gold')}>
      <div className="size-full overflow-hidden rounded-t-[245px] bg-[#E9E4DC]">{children}</div>
    </div>
  </div>
);

export function SectionHead({ eyebrow, title, right }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2.5"><Eyebrow>{eyebrow}</Eyebrow><H2>{title}</H2></div>{right}
    </div>
  );
}

export function ProductCard({ p, ratio = 'aspect-square' }) {
  const { add } = useStore();
  const [d] = p.sizes;
  const multi = p.sizes.length > 1;
  return (
    <div className="group flex flex-col border border-line bg-ivory">
      <Link to={`/product/${p.id}`} className={cx('relative block overflow-hidden', ratio)}>
        <Photo src={p.img} label={p.name} className="transition-transform duration-500 group-hover:scale-105" />
        <Badge color={p.color} abs>{p.available ? p.category : 'Sold out'}</Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-5 py-[18px]">
        <Link to={`/product/${p.id}`} className="font-display text-[25px] font-medium leading-[1.1] text-maroon">{p.name}</Link>
        <span className="mb-3.5 text-[13px] text-muted">{multi ? `${p.sizes.length} pack sizes` : d.label}</span>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line2 pt-3.5">
          <span className="text-[17px] font-medium">{multi && 'from '}{fmt(Math.min(...p.sizes.map(s => s.price)))}{d.label && <small className="text-[13px] font-light text-muted"> / {d.label}</small>}</span>
          <Btn sm disabled={!p.available} onClick={() => add(p, d)}>{p.available ? 'ADD' : 'SOLD OUT'}</Btn>
        </div>
      </div>
    </div>
  );
}

export function SoonCard({ p, ratio = 'aspect-[4/3]' }) {
  return (
    <div className="group flex flex-col border border-line bg-ivory">
      <Link to={`/coming-soon/${p.id}`} className={cx('relative block overflow-hidden', ratio)}>
        <Photo label={p.name} />
        <Badge color={p.color} abs>{p.room}</Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-5 py-[18px]">
        <Link to={`/coming-soon/${p.id}`} className="font-display text-[25px] font-medium leading-[1.1] text-maroon">{p.name}</Link>
        {p.sub && <span className="text-[13px] text-muted">{p.sub}</span>}
        <span className="mb-3.5 text-[13px] text-muted">{p.sizes.join(' · ')}</span>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line2 pt-3.5"><Label className="text-gold">Coming soon</Label></div>
      </div>
    </div>
  );
}

export const Skeleton = ({ n = 6, className = cx('pb-[72px]', PX) }) => (
  <div className={cx('grid gap-6 min-[560px]:grid-cols-2 lg:grid-cols-3', className)} aria-busy="true" aria-label="Loading products">
    {Array.from({ length: n }, (_, i) => <div key={i} className="aspect-[4/3] animate-pulse border border-line bg-ivory" />)}
  </div>
);

export const ErrorBox = ({ children, retry, className }) => (
  <div role="alert" className={cx('flex flex-col items-start gap-3 border border-kesar bg-ivory p-4 text-[14.5px] text-kesar', className)}>
    <span>{children}</span>
    {retry && <Btn sm ghost onClick={retry}>TRY AGAIN</Btn>}
  </div>
);

export const Qty = ({ value, set, big }) => (
  <div className={cx('inline-flex items-center border', big ? 'border-maroon' : 'border-line')}>
    <button type="button" className={cx('text-maroon', big ? 'h-[52px] w-11 text-xl' : 'w-[34px] py-2')} onClick={() => set(value - 1)} aria-label="Less">−</button>
    <span className={cx('text-center', big ? 'w-8 font-medium' : 'w-6')} aria-live="polite">{value}</span>
    <button type="button" className={cx('text-maroon', big ? 'h-[52px] w-11 text-xl' : 'w-[34px] py-2')} onClick={() => set(value + 1)} aria-label="More">+</button>
  </div>
);

export const Field = ({ label, className, area, ...p }) => {
  const C = area ? 'textarea' : 'input';
  return (
    <label className={cx('flex flex-col gap-0.5 border border-line bg-ivory px-3.5 py-2.5 focus-within:border-maroon', className)}>
      <span className="text-[11px] text-muted">{label}</span>
      <C className="w-full bg-transparent py-0.5 text-[15px]" {...p} />
    </label>
  );
};

// Plain-text page layout (help, policies). Children are bare h2 / p / ul / a elements.
export const Prose = ({ eyebrow = 'Help', title, intro, children }) => (
  <article className={cx('mx-auto flex max-w-[760px] flex-col gap-5 py-14 lg:py-20', PX)}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <H1>{title}</H1>
    {intro && <p className="font-display text-[22px] leading-[1.35] text-maroon">{intro}</p>}
    <div className="flex flex-col gap-4 text-base font-light leading-[1.7] [&_a]:border-b [&_a]:border-maroon [&_a]:text-maroon [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-[26px] [&_h2]:font-medium [&_h2]:text-maroon [&_li]:ml-5 [&_li]:list-disc">{children}</div>
  </article>
);

export const Lines = ({ children, className }) => <div className={cx('flex flex-col gap-2 text-[14.5px]', className)}>{children}</div>;
export const Line = ({ total, className, children }) => (
  <div className={cx('flex justify-between gap-3', total && 'mt-1 border-t border-line pt-3 text-[19px] font-medium', className)}>{children}</div>
);
