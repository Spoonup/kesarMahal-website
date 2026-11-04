import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { roomsOf, resolveShelf, isBox } from '../data';
import { ProductCard, Skeleton, ErrorBox, Btn, Eyebrow, ShelfTabs, H1, H2, PX, cx } from '../components/ui';
import usePageMeta from '../usePageMeta';

export default function Shop() {
  usePageMeta('Shop the pantry', 'Browse Kashmiri saffron, dry fruits, honey and kahwa. Prices shown before GST.');
  const { catalogue, loadCatalogue } = useStore();
  const [params, setParams] = useSearchParams();
  const raw = params.get('category') || 'All';
  const category = resolveShelf(raw);
  const q = params.get('q') || '';
  const needle = q.trim().toLowerCase();
  const live = catalogue.products.filter(p => !isBox(p));
  const rooms = roomsOf(live);
  const cats = ['All', ...rooms];
  const match = p => (category === 'All' || p.room === category) && (!needle || `${p.name} ${p.sub || ''} ${p.room} ${p.category || ''} ${p.desc || ''}`.toLowerCase().includes(needle));
  const items = live.filter(match);
  const update = (k, v) => setParams(cur => { const n = new URLSearchParams(cur); if (v && v !== 'All') n.set(k, v); else n.delete(k); return n; }, { replace: true });
  return (
    <>
      <div className={cx('flex flex-col gap-4 pb-7 pt-12 sm:flex-row sm:items-end sm:justify-between', PX)}>
        <div className="flex flex-col gap-2.5"><Eyebrow>Shop · {catalogue.status === 'ready' ? `${items.filter(p => p.available).length} available now` : 'the pantry'}</Eyebrow><H1>{category === 'All' ? 'The whole pantry' : category}</H1></div>
        <label className="flex w-full flex-col gap-0.5 border border-line bg-ivory px-3.5 py-2 focus-within:border-maroon focus-within:ring-2 focus-within:ring-maroon sm:w-[320px]">
          <span className="text-[11px] text-muted">Search</span>
          <input type="search" value={q} onChange={e => update('q', e.target.value)} placeholder="Almonds, honey, muesli…" className="w-full bg-transparent py-0.5 text-[15px]" />
        </label>
      </div>
      <div className={cx('pb-8', PX)}><ShelfTabs active={category} onPick={r => update('category', r)} items={cats.map(r => ({ label: r, count: catalogue.status === 'ready' ? live.filter(p => r === 'All' || p.room === r).length : null }))} /></div>
      {catalogue.status === 'loading' ? <Skeleton /> : catalogue.status === 'error' ? (
        <div className={cx('pb-24', PX)}><ErrorBox retry={loadCatalogue}>{catalogue.error || 'Could not load the pantry.'}</ErrorBox></div>
      ) : items.length ? (
        <div className={cx('grid gap-6 pb-[72px] min-[560px]:grid-cols-2 lg:grid-cols-3', PX)}>{items.map(p => <ProductCard key={p.id} p={p} ratio="aspect-[4/3]" />)}</div>
      ) : (
        <div className={cx('flex flex-col items-start gap-4 pb-24 pt-8', PX)}><H2>Nothing matches yet.</H2><Btn ghost onClick={() => setParams({}, { replace: true })}>CLEAR FILTERS</Btn></div>
      )}
    </>
  );
}
