import { useEffect, useRef, useState } from 'react';
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
  const sizes = p.sizes.filter(z => z.price > 0);
  const [pick, setPick] = useState(0);
  const z = sizes[pick] || sizes[0];
  const to = `/product/${p.id}`;
  const ok = p.available && !!z;
  return (
    <div className="group flex flex-col border border-line bg-ivory">
      <Link to={to} className={cx('relative block overflow-hidden', ratio)}>
        <Photo src={p.img} label={p.name} className="transition-transform duration-500 group-hover:scale-105" />
        <Badge color={p.color} abs>{p.available ? p.category : 'Sold out'}</Badge>
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-[18px]">
        <Link to={to} className="font-display text-[25px] font-medium leading-[1.1] text-maroon decoration-gold decoration-1 underline-offset-4 hover:underline">{p.name}</Link>
        <i className="my-3 block h-px w-8 bg-gold" />
        <p className="line-clamp-2 min-h-[2.5em] font-display text-[15.5px] italic leading-[1.25] text-ink/75">{p.desc}</p>
        {sizes.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pack size">
            {sizes.map((s, i) => (
              <button key={s.id} type="button" aria-pressed={i === pick} onClick={() => setPick(i)}
                className={cx('min-h-11 rounded-full border px-4 text-[13px]', i === pick ? 'border-maroon bg-maroon text-ivory' : 'border-line text-ink hover:border-maroon')}>{s.label}</button>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[19px] font-medium">{z ? fmt(z.price) : ''}{z?.label && <small className="text-[13px] font-light text-muted"> / {z.label}</small>}</span>
            <Link to={to} className="font-cinzel text-[10px] uppercase tracking-[.22em] text-gold hover:text-maroon">View details</Link>
          </div>
          <button type="button" disabled={!ok} onClick={() => add(p, z)}
            className="min-h-11 border border-maroon bg-maroon font-cinzel text-[12px] uppercase tracking-[.22em] text-ivory hover:bg-[#561020] disabled:cursor-not-allowed disabled:border-[#9C8C80] disabled:bg-[#9C8C80]">{ok ? 'Add to bag' : 'Sold out'}</button>
        </div>
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

// Dark, full-width "Continue with Google" button (Google's round G on ivory).
export const GoogleBtn = ({ children = 'Continue with Google', ...p }) => (
  <button type="button" className="flex w-full items-center justify-center gap-3 bg-ink px-6 py-3.5 text-[15px] text-ivory transition-colors hover:bg-maroon" {...p}>
    <span className="grid size-6 place-items-center rounded-full bg-ivory"><svg viewBox="0 0 48 48" className="size-4" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg></span>
    {children}
  </button>
);

// Quiet typographic shelf filter: Cinzel caps, gold thread under the active/hovered item, hairline under the row.
// Scrolls sideways on small screens (right-edge fade hints at more) and keeps the active item in view.
export function ShelfTabs({ items, active, onPick, className }) {
  const row = useRef(null);
  const [more, setMore] = useState(false);
  const check = () => { const r = row.current; if (r) setMore(r.scrollLeft + r.clientWidth < r.scrollWidth - 4); };
  useEffect(() => {
    const r = row.current, el = r?.querySelector('[aria-pressed="true"]');
    if (el && (el.offsetLeft + el.offsetWidth > r.scrollLeft + r.clientWidth || el.offsetLeft < r.scrollLeft)) r.scrollTo({ left: el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [active, items.map(i => i.count).join()]);
  return (
    <nav aria-label="Shop by shelf" className={cx('border-b border-line', className)}>
      <div ref={row} onScroll={check} className={cx('relative flex snap-x overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', more && '[mask-image:linear-gradient(to_right,#000_calc(100%-48px),transparent)]')}>
        {items.map(({ label, count }) => {
          const on = label === active;
          return (
            <button key={label} type="button" onClick={() => onPick(label)} aria-pressed={on} className={cx('group relative min-h-11 shrink-0 snap-center whitespace-nowrap px-2.5 font-cinzel text-[11.5px] uppercase tracking-[.14em] outline-none transition-colors first:pl-0 focus-visible:text-maroon focus-visible:ring-1 focus-visible:ring-gold', on ? 'text-maroon' : 'text-ink/60 hover:text-maroon')}>
              {label}{count != null && <span className="ml-1.5 text-[10px] tracking-[.1em] text-ink/40">{count}</span>}
              <span aria-hidden className={cx('absolute inset-x-2.5 bottom-0 h-0.5 origin-left bg-gold transition-transform duration-300 group-first:left-0', on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100')} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
