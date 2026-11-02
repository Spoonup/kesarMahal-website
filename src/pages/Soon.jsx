import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { soonItems } from '../data';
import { Photo, Badge, Btn, Label, H1, PX, cx } from '../components/ui';
import NotFound from './NotFound';

// Coming-soon product: no price, no bag. Ids differ from live ids (route /coming-soon/:id).
export default function Soon() {
  const { id } = useParams();
  const { catalogue } = useStore();
  const p = soonItems(catalogue.products).find(x => x.id === id);
  if (!p) return <NotFound />;
  return (
    <>
      <div className={cx('pt-5 text-[12.5px] text-muted', PX)}><Link to="/shop">Shop</Link> / <Link to={`/shop?category=${encodeURIComponent(p.room)}`}>{p.room}</Link> / <span className="text-ink">{p.name}</span></div>
      <div className={cx('grid gap-14 pb-24 pt-6 lg:grid-cols-[1.1fr_1fr]', PX)}>
        <div className="p-2"><div className="aspect-[4/5] overflow-hidden rounded-t-[240px] outline outline-1 outline-offset-8 outline-gold"><Photo label={p.name} /></div></div>
        <div className="flex flex-col gap-[22px] pt-3">
          <div className="flex flex-wrap items-center gap-2.5"><Badge color={p.color}>{p.room}</Badge><Label className="text-gold">Coming soon</Label></div>
          <H1 className="text-[clamp(44px,5vw,58px)]">{p.name}</H1>
          {p.sub && <p className="text-[15.5px] font-light leading-[1.65]">{p.sub}</p>}
          {p.sizes.length > 0 && <div className="flex flex-col gap-2"><Label className="text-gold">Planned pack sizes</Label><span className="text-[15px]">{p.sizes.join(' · ')}</span></div>}
          <p className="text-[14.5px] text-muted">This treasure is not in the shop yet. Prices and ordering open when it arrives.</p>
          <Btn to={`/shop?category=${encodeURIComponent(p.room)}`} ghost className="self-start">SHOP {p.room.toUpperCase()}</Btn>
        </div>
      </div>
    </>
  );
}
