import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { soonItems, roomsOf } from '../data';
import { ProductCard, SoonCard, Skeleton, ErrorBox, Btn, Eyebrow, H1, H2, PX, cx } from '../components/ui';

export default function Shop() {
  const { catalogue, loadCatalogue } = useStore();
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const q = params.get('q') || '';
  const needle = q.trim().toLowerCase();
  const live = catalogue.products;
  const soon = soonItems(live);
  const rooms = roomsOf(live, soon);
  const cats = ['All', ...rooms];
  const match = p => (category === 'All' || p.room === category) && (!needle || `${p.name} ${p.sub || ''} ${p.room} ${p.category || ''} ${p.desc || ''}`.toLowerCase().includes(needle));
  // Live first, coming soon after, grouped by room (stable sort keeps the live shelf order).
  const items = [...live.filter(match), ...soon.filter(match)].sort((a, b) => rooms.indexOf(a.room) - rooms.indexOf(b.room));
  const nLive = items.filter(p => !p.soon).length;
  const update = (k, v) => setParams(cur => { const n = new URLSearchParams(cur); if (v && v !== 'All') n.set(k, v); else n.delete(k); return n; }, { replace: true });
  return (
    <>
      <div className={cx('flex flex-col gap-4 pb-7 pt-12 sm:flex-row sm:items-end sm:justify-between', PX)}>
        <div className="flex flex-col gap-2.5"><Eyebrow>Shop · {catalogue.status === 'ready' ? `${nLive} available now · ${items.length - nLive} coming soon` : 'the pantry'}</Eyebrow><H1>{category === 'All' ? 'The whole pantry' : category}</H1></div>
        <label className="flex w-full flex-col gap-0.5 border border-line bg-ivory px-3.5 py-2 focus-within:border-maroon sm:w-[320px]">
          <span className="text-[11px] text-muted">Search</span>
          <input type="search" value={q} onChange={e => update('q', e.target.value)} placeholder="Almonds, honey, muesli…" className="w-full bg-transparent py-0.5 text-[15px]" />
        </label>
      </div>
      <div className={cx('flex flex-wrap gap-2.5 pb-8', PX)}>
        {cats.map(r => <button key={r} onClick={() => update('category', r)} aria-pressed={r === category} className={cx('rounded-full border border-maroon px-[18px] py-2.5 text-[13.5px]', r === category ? 'bg-maroon text-ivory' : 'text-maroon')}>{r}</button>)}
      </div>
      {catalogue.status === 'loading' ? <Skeleton /> : catalogue.status === 'error' ? (
        <div className={cx('pb-24', PX)}><ErrorBox retry={loadCatalogue}>{catalogue.error || 'Could not load the pantry.'}</ErrorBox></div>
      ) : items.length ? (
        <div className={cx('grid gap-6 pb-[72px] min-[560px]:grid-cols-2 lg:grid-cols-3', PX)}>{items.map(p => p.soon ? <SoonCard key={`s${p.id}`} p={p} /> : <ProductCard key={p.id} p={p} ratio="aspect-[4/3]" />)}</div>
      ) : (
        <div className={cx('flex flex-col items-start gap-4 pb-24 pt-8', PX)}><H2>Nothing matches yet.</H2><Btn ghost onClick={() => setParams({}, { replace: true })}>CLEAR FILTERS</Btn></div>
      )}
    </>
  );
}
