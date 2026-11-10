import { useState } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { categoriesOf, resolveShelf } from '../data';
import { cx, Label, PX } from './ui';

export const Wordmark = ({ size = 26, to = '/', className }) => (
  <Link to={to} className={cx('flex flex-col items-center gap-1 text-maroon', className)}>
    <span className="font-cinzel font-medium leading-none tracking-[.04em]" style={{ fontSize: size }}>Kesar Mahal</span>
    <small className="font-cinzel text-[7px] uppercase tracking-[.2em] text-pine sm:text-[8.5px] sm:tracking-[.34em]">Treasures from Kashmir</small>
  </Link>
);

// Nav label: Cinzel caps with a gold thread that draws in on hover and stays on the current page.
const NavLink = ({ on, className, children, ...p }) => (
  <Link aria-current={on ? 'page' : undefined} className={cx('group whitespace-nowrap font-cinzel text-[11px] uppercase tracking-[.12em] text-ink min-[1280px]:text-[11.5px] min-[1280px]:tracking-[.2em] hover:text-maroon', on && 'text-maroon', className)} {...p}>
    <span className={cx('relative inline-block py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 group-hover:after:scale-x-100', on ? 'after:scale-x-100' : 'after:scale-x-0')}>{children}</span>
  </Link>
);
const BagIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);

export function Header() {
  const { count, user, catalogue } = useStore();
  const cats = ['Dry Fruits & Berries', 'Honey'].filter(r => categoriesOf(catalogue.products).includes(r));
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);
  const room = pathname === '/shop' ? params.get('category') : null;
  const username = String(user?.username || '').trim();
  const emailLocal = String(user?.email || '').split('@')[0];
  const name = username || (emailLocal.length > 18 ? `${emailLocal.slice(0, 16)}…` : emailLocal) || 'Account';
  const pill = 'min-h-11 items-center gap-2 rounded-full border px-5 text-[13px] tracking-[.04em] transition-colors';
  const mob = 'px-5 py-3.5 nav:p-0';
  return (
    <>
      <div className="bg-maroon px-4 py-[9px] text-center text-[11.5px] uppercase tracking-[.18em] text-[#EADFD0]">
        Treasures from Kashmir · Shipped across India
      </div>
      <header className="sticky top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-gold/40 bg-ivory px-3.5 py-2.5 sm:px-5 nav:px-8 nav:py-[18px] min-[1280px]:px-12">
        <button className="col-start-1 row-start-1 grid size-11 place-items-center justify-self-start text-[22px] text-maroon nav:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}>{open ? '✕' : '☰'}</button>
        <nav onClick={() => setOpen(false)} className={cx('absolute inset-x-0 top-full flex-col divide-y divide-line2 border-b border-gold/40 bg-ivory shadow-lg nav:static nav:col-start-1 nav:row-start-1 nav:flex nav:flex-row nav:gap-4 min-[1280px]:gap-7 nav:divide-y-0 nav:border-0 nav:bg-transparent nav:shadow-none min-[1500px]:gap-9', open ? 'flex' : 'hidden')}>
          <NavLink to="/shop" on={pathname === '/shop' && !room} className={mob}>Shop all</NavLink>
          {cats.map(r => <NavLink key={r} to={`/shop?category=${encodeURIComponent(r)}`} on={room !== null && resolveShelf(room) === r} className={mob}>{r === 'Dry Fruits & Berries' ? 'Dry Fruits' : r}</NavLink>)}
          <NavLink to="/gifting" on={pathname === '/gifting'} className={mob}>Gifting</NavLink>
          <NavLink to="/story" on={pathname === '/story'} className={cx(mob, 'nav:hidden')}>Our Story</NavLink>
          <NavLink to={user ? '/account' : '/signin'} className={cx(mob, 'sm:hidden')}>{user ? 'Account' : 'Sign in'}</NavLink>
        </nav>
        <Wordmark className="col-start-2 row-start-1 justify-self-center" />
        <div className="col-start-3 row-start-1 flex items-center justify-end gap-2.5 whitespace-nowrap font-sans nav:gap-4">
          <NavLink to="/story" on={pathname === '/story'} className="hidden nav:inline">Our Story</NavLink>
          <Link to={user ? '/account' : '/signin'} className={cx(pill, 'hidden border-gold/60 bg-ivory text-maroon hover:border-maroon sm:inline-flex')}>
            {user && <span className="grid size-5 place-items-center rounded-full bg-maroon text-[11px] uppercase text-ivory">{name[0]}</span>}
            {user ? name : 'Sign in'}
          </Link>
          <Link to="/bag" aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`} className={cx(pill, 'inline-flex border-maroon bg-maroon px-3.5 text-ivory hover:bg-[#561020] sm:px-5')}>
            <BagIcon /><span className="hidden sm:inline">Bag</span>
            {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ivory px-1.5 text-[11px] font-medium leading-none text-maroon">{count}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}

const FL = ({ to, children }) => <Link to={to} className="hover:text-gold2">{children}</Link>;
const FH = ({ children }) => <Label className="mb-1.5 text-[10.5px] text-gold2">{children}</Label>;

export function Footer() {
  const [done, setDone] = useState(false);
  const { catalogue } = useStore();
  const cats = categoriesOf(catalogue.products).slice(0, 4);
  return (
    <footer className={cx('flex flex-col gap-12 bg-ink pb-7 pt-16 text-[#EADFD0]', PX)}>
      <div className="grid grid-cols-2 gap-10 text-sm font-light md:grid-cols-[2fr_1fr_1fr_1fr] [&>div]:flex [&>div]:flex-col [&>div]:gap-2.5">
        <div className="col-span-2 md:col-span-1">
          <span className="font-cinzel text-2xl font-medium text-ivory">Kesar Mahal</span>
          <p className="max-w-[340px] text-[14.5px]">Letters from the valley: harvest news, recipes, first access to limited lots. Once a month.</p>
          {done ? <p className="text-gold2">Shukriya. Look out for the next letter.</p> : (
            <form className="flex max-w-[380px] border-b border-gold focus-within:ring-2 focus-within:ring-gold2" onSubmit={e => { e.preventDefault(); setDone(true); }}>
              <input type="email" required placeholder="Your email" className="w-full bg-transparent py-3 text-ivory placeholder:text-[#A8998C]" />
              <button className="font-cinzel text-[11px] uppercase tracking-[.24em] text-gold2">Subscribe</button>
            </form>
          )}
        </div>
        <div><FH>Shop</FH><FL to="/shop">All products</FL>{cats.map(c => <FL key={c} to={`/shop?category=${encodeURIComponent(c)}`}>{c}</FL>)}<FL to="/gifting">Gifting</FL></div>
        <div><FH>House</FH><FL to="/story">Our Story</FL><FL to="/contact">Contact</FL></div>
        <div><FH>Help</FH><FL to="/shipping">Shipping</FL><FL to="/returns">Returns</FL><FL to="/track">Track order</FL><FL to="/storage">Storage guide</FL><FL to="/faq">FAQ</FL></div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-gold/40 pt-5 text-[12.5px] font-light">
        <em className="font-display text-[17px] text-gold2">A Spoonup house</em><span>© 2026 Kesar Mahal · <FL to="/terms">Terms</FL> · <FL to="/privacy">Privacy</FL></span>
      </div>
    </footer>
  );
}
