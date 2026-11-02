import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { fmt, imgSrc } from '../data';

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
  const [unit, price] = p.sizes[0];
  return (
    <div className="group flex flex-col border border-line bg-ivory">
      <Link to={`/product/${p.id}`} className={cx('relative block overflow-hidden', ratio)}>
        <Photo src={imgSrc(p)} label={p.name} className="transition-transform duration-500 group-hover:scale-105" />
        <Badge color={p.color} abs>{p.grade}</Badge>
      </Link>
      <div className="flex flex-1 flex-col gap-1 px-5 py-[18px]">
        <Link to={`/product/${p.id}`} className="font-display text-[25px] font-medium leading-[1.1] text-maroon">{p.name}</Link>
        <span className="mb-3.5 text-[13px] text-muted">{p.sub}</span>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line2 pt-3.5">
          <span className="text-[17px] font-medium">from {fmt(price)} <small className="text-[13px] font-light text-muted">/ {unit}</small></span>
          <Btn sm onClick={() => add({ key: `${p.id}|${unit}`, kind: 'item', id: p.id, name: p.name, sub: unit, grade: p.grade, color: p.color, img: imgSrc(p), price, qty: 1 })}>ADD</Btn>
        </div>
      </div>
    </div>
  );
}

export const Qty = ({ value, set, big }) => (
  <div className={cx('inline-flex items-center border', big ? 'border-maroon' : 'border-line')}>
    <button className={cx('text-maroon', big ? 'h-[52px] w-11 text-xl' : 'w-[34px] py-2')} onClick={() => set(value - 1)} aria-label="Less">−</button>
    <span className={cx('text-center', big ? 'w-8 font-medium' : 'w-6')}>{value}</span>
    <button className={cx('text-maroon', big ? 'h-[52px] w-11 text-xl' : 'w-[34px] py-2')} onClick={() => set(value + 1)} aria-label="More">+</button>
  </div>
);

export const Field = ({ label, className, ...p }) => (
  <label className={cx('flex flex-col gap-0.5 border border-line bg-ivory px-3.5 py-2.5 focus-within:border-maroon', className)}>
    <span className="text-[11px] text-muted">{label}</span>
    <input className="w-full bg-transparent py-0.5 text-[15px]" {...p} />
  </label>
);

export const Lines = ({ children, className }) => <div className={cx('flex flex-col gap-2 text-[14.5px]', className)}>{children}</div>;
export const Line = ({ total, className, children }) => (
  <div className={cx('flex justify-between gap-3', total && 'mt-1 border-t border-line pt-3 text-[19px] font-medium', className)}>{children}</div>
);
