import { useSearchParams } from 'react-router-dom';
import { products, roomList } from '../data';
import { ProductCard, Btn, Eyebrow, H1, H2, PX, cx } from '../components/ui';

const ROOMS = ['All', ...roomList, 'Gifting'];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const room = params.get('room') || 'All';
  const q = (params.get('q') || '').toLowerCase();
  const items = products.filter(p => (room === 'All' || p.room === room) && (!q || `${p.name} ${p.sub} ${p.grade}`.toLowerCase().includes(q)));
  const pick = r => setParams(r === 'All' ? {} : { room: r });
  return (
    <>
      <div className={cx('flex flex-col gap-4 pb-7 pt-12 sm:flex-row sm:items-end sm:justify-between', PX)}>
        <div className="flex flex-col gap-2.5"><Eyebrow>Shop · {items.length} treasures</Eyebrow><H1>{q ? `“${params.get('q')}”` : 'The whole pantry'}</H1></div>
        <span className="text-[13px] text-muted">Sort: <b className="border-b border-ink font-normal text-ink">Most gifted</b></span>
      </div>
      <div className={cx('flex flex-wrap gap-2.5 pb-8', PX)}>
        {ROOMS.map(r => <button key={r} onClick={() => pick(r)} className={cx('rounded-full border border-maroon px-[18px] py-2.5 text-[13.5px]', r === room ? 'bg-maroon text-ivory' : 'text-maroon')}>{r}</button>)}
      </div>
      {room === 'Gifting' ? (
        <div className={cx('flex flex-col items-start gap-4 pb-24 pt-8', PX)}><H2>Gifts are built, not picked.</H2><p>Choose a box, fill it with your favourite treasures and add a note.</p><Btn to="/gift">BUILD A GIFT BOX</Btn></div>
      ) : items.length ? (
        <div className={cx('grid gap-6 pb-[72px] min-[560px]:grid-cols-2 lg:grid-cols-3', PX)}>{items.map(p => <ProductCard key={p.id} p={p} ratio="aspect-[4/3]" />)}</div>
      ) : (
        <div className={cx('flex flex-col items-start gap-4 pb-24 pt-8', PX)}><H2>Nothing matches yet.</H2><Btn ghost onClick={() => setParams({})}>CLEAR FILTERS</Btn></div>
      )}
    </>
  );
}
