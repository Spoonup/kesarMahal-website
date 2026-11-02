import { Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { fmt, SPOONUP_CREDIT } from '../data';
import { LotTrace } from './Home';
import { eta } from './Confirmed';
import { Btn, Label, H2, TextBtn, PX, cx } from '../components/ui';

const navItem = 'px-3.5 py-2.5 text-left';

export default function Account() {
  const { user, setUser, orders, add } = useStore();
  const nav = useNavigate();
  if (!user) return <Navigate to="/signin" replace />;
  const [latest, ...past] = orders;
  const reorder = o => { o.items.forEach(i => i.kind === 'item' && add({ ...i })); nav('/bag'); };
  return (
    <div className={cx('grid gap-12 pb-[72px] pt-12 md:grid-cols-[240px_minmax(0,1fr)]', PX)}>
      <aside className="flex flex-col text-[15px]">
        <span className="mb-4 font-display text-[30px] font-medium text-maroon">Salaam{user.name ? `, ${user.name}` : ''}</span>
        <span className={cx(navItem, 'bg-maroon text-ivory')}>Orders</span><span className={navItem}>Gift boxes</span><span className={navItem}>Addresses</span>
        <span className={navItem}>Spoonup credit · {fmt(SPOONUP_CREDIT)}</span><span className={navItem}>Letters from the valley</span>
        <TextBtn className={cx(navItem, 'text-muted')} onClick={() => { setUser(null); nav('/'); }}>Sign out</TextBtn>
      </aside>
      <div className="flex flex-col gap-7">
        {latest ? (
          <div className="flex flex-col gap-2 border border-line bg-ivory p-7">
            <Label className="text-[10.5px] text-kesar">Packing in Srinagar</Label>
            <span className="font-display text-[clamp(24px,3vw,30px)] font-medium text-maroon">{latest.id} · arriving {eta(latest.placed)}</span>
            <span className="text-sm font-light">{latest.items.length} item{latest.items.length > 1 ? 's' : ''} · {fmt(latest.total)}</span>
            <div className="mt-2 flex gap-1.5"><i className="h-1 flex-1 bg-maroon" /><i className="h-1 flex-1 bg-line2" /><i className="h-1 flex-1 bg-line2" /><i className="h-1 flex-1 bg-line2" /></div>
          </div>
        ) : <div className="flex flex-col items-start gap-4"><H2>No orders yet.</H2><Btn to="/shop">SHOP THE HARVEST</Btn></div>}
        {past.length > 0 && (
          <div><Label className="mb-2.5 block text-gold">Past orders</Label>
            {past.map(o => (
              <div key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-1 border-t border-line py-[18px] text-[14.5px] md:grid-cols-[140px_minmax(0,1fr)_120px_auto]">
                <span className="font-mono text-[13px] font-medium">{o.id}</span><span className="order-last col-span-2 font-light md:order-none md:col-span-1">{o.items.map(i => i.name).join(' · ')}</span><span>{fmt(o.total)}</span>
                <button className="border-b border-maroon text-[13px] text-maroon" onClick={() => reorder(o)}>Reorder</button></div>))}
          </div>
        )}
        <div className="jaali grid items-center gap-6 p-7 text-ivory md:grid-cols-2">
          <div className="bg-maroon p-0.5"><span className="font-display text-[28px] font-medium">Trace a lot</span><p className="mt-1.5 text-sm font-light text-[#EADFD0]">Find the code on the back of any pack.</p></div>
          <div className="bg-maroon p-0.5"><LotTrace /></div>
        </div>
      </div>
    </div>
  );
}
