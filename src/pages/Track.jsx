import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, savedOrderIds } from '../api';
import { statusInfo } from '../data';
import { useStore } from '../store';
import { Prose } from '../components/ui';
import usePageMeta from '../usePageMeta';

const date = d => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// The backend can open an order only by its internal id plus the token saved on the device that placed it, so this
// page lists the orders saved on THIS device. A lookup by order number needs a backend endpoint (docs/BACKEND-REQUESTS.md #5).
export default function Track() {
  usePageMeta('Track an order', 'Open orders placed on this device.');
  const { user } = useStore();
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let live = true;
    const ids = savedOrderIds().slice(-10).reverse();
    Promise.all(ids.map(id => api.order(id).then(o => ({ id, o }), () => ({ id, o: null }))))
      .then(r => live && setRows(r));
    return () => { live = false; };
  }, []);
  return (
    <Prose title="Track order" intro="Orders open on the device that placed them.">
      {rows === null && <p className="text-muted" aria-busy="true">Looking for orders on this device…</p>}
      {rows?.length > 0 && (
        <div className="flex flex-col">
          {rows.map(({ id, o }) => (
            <div key={id} className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-t border-line py-3.5 text-[14.5px]">
              <span><span className="font-mono text-[13px] font-medium">{o ? `#${o.orderNumber}` : 'Saved order'}</span>{o && <span className="text-muted"> · {statusInfo(o).label} · {date(o.createdAt)}</span>}</span>
              <Link to={`/confirmed/${id}`}>View order</Link>
            </div>
          ))}
        </div>
      )}
      {rows?.length === 0 && <p>There are no saved orders on this device.</p>}
      <p className="text-[14px] text-muted">We cannot yet look an order up by its number. A guest order can only be opened on the browser that placed it{user ? '' : <>; if you ordered while signed in, <Link to="/signin?next=/account">sign in</Link> to see it in your account</>}. On another device, <Link to="/contact">contact us</Link> with your order number and we will help.</p>
    </Prose>
  );
}
