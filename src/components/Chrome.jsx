import { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { cx, Label, PX } from './ui';

export const Wordmark = ({ size = 26, to = '/', className }) => (
  <Link to={to} className={cx('flex flex-col items-center gap-1 text-maroon', className)}>
    <span className="font-cinzel font-medium leading-none tracking-[.04em]" style={{ fontSize: size }}>Kesar Mahal</span>
    <small className="font-cinzel text-[7px] uppercase tracking-[.2em] text-pine sm:text-[8.5px] sm:tracking-[.34em]">Treasures from Kashmir</small>
  </Link>
);

export function Header() {
  const { count, user } = useStore();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const room = pathname === '/shop' ? params.get('room') : null;
  const link = on => cx('whitespace-nowrap nav:border-b nav:border-transparent', on && 'text-maroon nav:border-maroon');
  const mob = 'border-t border-line2 px-5 py-3.5 nav:border-0 nav:p-0';
  return (
    <>
      <div className="bg-maroon px-4 py-[9px] text-center text-[11.5px] uppercase tracking-[.18em] text-[#EADFD0]">
        New harvest Mongra Kesar has arrived · Free shipping on gift boxes above ₹2,000
      </div>
      <header className="sticky top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-line bg-ivory px-3.5 py-3 text-sm sm:px-5 nav:grid-cols-[1fr_auto_1fr] nav:px-12 nav:py-[18px]">
        <button className="col-start-1 row-start-1 text-[22px] text-maroon nav:hidden" onClick={() => setOpen(o => !o)} aria-label="Menu">{open ? '✕' : '☰'}</button>
        <nav onClick={() => setOpen(false)} className={cx('absolute inset-x-0 top-full flex-col border-b border-line bg-ivory nav:static nav:col-start-1 nav:row-start-1 nav:flex nav:flex-row nav:gap-7 nav:border-0 nav:bg-transparent', open ? 'flex' : 'hidden')}>
          {['Dry Fruits', 'Kesar', 'Kahwa'].map(r => <Link key={r} to={`/shop?room=${r}`} className={cx(mob, link(room === r))}>{r}</Link>)}
          <Link to="/gift" className={cx(mob, link(pathname === '/gift'))}>Gifting</Link>
          <Link to="/story" className={cx(mob, 'nav:hidden')}>Our Story</Link>
        </nav>
        <Wordmark className="col-start-2 row-start-1 justify-self-center" />
        <div className="col-start-3 row-start-1 flex items-center justify-end gap-3 text-[13px] whitespace-nowrap nav:gap-6 nav:text-sm">
          <Link to="/story" className="hidden nav:inline">Our Story</Link>
          <button className="hidden sm:inline" onClick={() => setSearch(s => !s)}>Search</button>
          <Link to={user ? '/account' : '/signin'}>{user ? 'Account' : 'Sign in'}</Link>
          <Link to="/bag" className="font-medium text-maroon">Bag ({count})</Link>
        </div>
      </header>
      {search && (
        <form className="border-b border-line bg-ivory px-5 py-3 nav:px-12" onSubmit={e => { e.preventDefault(); nav('/shop?q=' + encodeURIComponent(e.target.q.value)); setSearch(false); }}>
          <input name="q" autoFocus placeholder="Search the pantry: almonds, saffron, kahwa…" className="w-full border border-line bg-ivory px-3.5 py-3 focus:border-maroon" />
        </form>
      )}
    </>
  );
}

const FL = ({ to, children }) => <Link to={to} className="hover:text-gold2">{children}</Link>;
const FH = ({ children }) => <Label className="mb-1.5 text-[10.5px] text-gold2">{children}</Label>;

export function Footer() {
  const [done, setDone] = useState(false);
  return (
    <footer className={cx('flex flex-col gap-12 bg-ink pb-7 pt-16 text-[#EADFD0]', PX)}>
      <div className="grid grid-cols-2 gap-10 text-sm font-light md:grid-cols-[2fr_1fr_1fr_1fr] [&>div]:flex [&>div]:flex-col [&>div]:gap-2.5">
        <div className="col-span-2 md:col-span-1">
          <span className="font-cinzel text-2xl font-medium text-ivory">Kesar Mahal</span>
          <p className="max-w-[340px] text-[14.5px]">Letters from the valley: harvest news, recipes, first access to limited lots. Once a month.</p>
          {done ? <p className="text-gold2">Shukriya. Look out for the next letter.</p> : (
            <form className="flex max-w-[380px] border-b border-gold" onSubmit={e => { e.preventDefault(); setDone(true); }}>
              <input type="email" required placeholder="Your email" className="w-full bg-transparent py-3 text-ivory placeholder:text-[#8A7A6E]" />
              <button className="font-cinzel text-[11px] uppercase tracking-[.24em] text-gold2">Subscribe</button>
            </form>
          )}
        </div>
        <div><FH>Shop</FH><FL to="/shop?room=Dry Fruits">Dry Fruits</FL><FL to="/shop?room=Kesar">Kesar</FL><FL to="/shop?room=Kahwa">Kahwa</FL><FL to="/gift">Gift Boxes</FL></div>
        <div><FH>House</FH><FL to="/story">Our Story</FL><FL to="/account">Trace a Lot</FL><FL to="/gift">Corporate Gifting</FL><FL to="/story">Contact</FL></div>
        <div><FH>Help</FH><span>Shipping</span><span>Returns</span><span>Storage guide</span><span>FAQ</span></div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-gold/40 pt-5 text-[12.5px] font-light">
        <em className="font-display text-[17px] text-gold2">A Spoonup house</em><span>© 2026 Kesar Mahal · Terms · Privacy</span>
      </div>
    </footer>
  );
}
