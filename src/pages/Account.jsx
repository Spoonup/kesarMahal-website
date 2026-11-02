import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { api, friendly } from '../api';
import { fmt } from '../data';
import { LotTrace } from './Home';
import { Btn, Field, Label, H2, TextBtn, ErrorBox, PX, cx } from '../components/ui';

const navItem = 'px-3.5 py-2.5 text-left';
const blank = { label: 'Home', line1: '', city: '', pincode: '' };

export default function Account() {
  const { user, authReady, signOut, add, byId } = useStore();
  const nav = useNavigate();
  const [orders, setOrders] = useState({ status: 'loading', rows: [], error: '' });
  const [addrs, setAddrs] = useState([]);
  const [form, setForm] = useState(null);
  const [err, setErr] = useState('');
  const loadOrders = () => { setOrders(o => ({ ...o, status: 'loading' })); api.myOrders().then(rows => setOrders({ status: 'ready', rows, error: '' })).catch(e => setOrders({ status: 'error', rows: [], error: friendly(e) })); };
  useEffect(() => { if (user) { loadOrders(); api.addresses().then(setAddrs).catch(() => {}); } }, [user]);
  if (!authReady) return <p className={cx('py-20', PX)} aria-busy="true">Loading…</p>;
  if (!user) return <Navigate to="/signin" replace />;
  const reorder = o => { o.items.forEach(i => { const p = byId(i.id); const s = p?.sizes.find(z => z.id && (z.id === i.sizeId || i.name.includes(`(${z.label})`))) || p?.sizes[0]; if (p?.available) add(p, s, i.quantity); }); nav('/bag'); };
  const save = async e => {
    e.preventDefault(); setErr('');
    try { const a = await api.addAddress({ ...form, line1: form.line1.trim(), city: form.city.trim() }); setAddrs(r => [...r, a]); setForm(null); } catch (ex) { setErr(friendly(ex)); }
  };
  const drop = async id => { try { await api.deleteAddress(id); setAddrs(r => r.filter(a => a.id !== id)); } catch (ex) { setErr(friendly(ex)); } };
  const { rows, status } = orders;
  return (
    <div className={cx('grid gap-12 pb-[72px] pt-12 md:grid-cols-[240px_minmax(0,1fr)]', PX)}>
      <aside className="flex flex-col text-[15px]">
        <span className="mb-4 font-display text-[30px] font-medium text-maroon">Salaam, {user.username}</span>
        <span className={cx(navItem, 'bg-maroon text-ivory')}>Orders</span><span className={navItem}>{user.email}</span>
        <TextBtn className={cx(navItem, 'text-muted')} onClick={() => { signOut(); nav('/'); }}>Sign out</TextBtn>
      </aside>
      <div className="flex flex-col gap-9">
        <div>
          <Label className="mb-2.5 block text-gold">Your orders</Label>
          {status === 'loading' && <p aria-busy="true" className="text-muted">Loading orders…</p>}
          {status === 'error' && <ErrorBox retry={loadOrders}>{orders.error}</ErrorBox>}
          {status === 'ready' && !rows.length && <div className="flex flex-col items-start gap-4"><H2>No orders yet.</H2><Btn to="/shop">SHOP THE HARVEST</Btn></div>}
          {rows.map(o => (
            <div key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-1 border-t border-line py-[18px] text-[14.5px] md:grid-cols-[110px_minmax(0,1fr)_110px_auto_auto]">
              <span className="font-mono text-[13px] font-medium">#{o.orderNumber}</span>
              <span className="order-last col-span-2 font-light md:order-none md:col-span-1">{o.items.map(i => `${i.name} × ${i.quantity}`).join(' · ')} <em className="text-muted">({String(o.status).replace(/_/g, ' ')})</em></span>
              <span>{fmt(o.totalAmount)}</span>
              <button className="border-b border-maroon text-[13px] text-maroon" onClick={() => reorder(o)}>Reorder</button>
              <Link className="border-b border-maroon text-[13px] text-maroon" to={`/confirmed/${o.id}`}>View</Link>
            </div>
          ))}
        </div>
        <div>
          <div className="mb-2.5 flex items-center justify-between"><Label className="text-gold">Saved addresses</Label>{!form && <button className="border-b border-maroon text-[13px] text-maroon" onClick={() => setForm(blank)}>Add address</button>}</div>
          {err && <ErrorBox className="mb-3">{err}</ErrorBox>}
          {addrs.map(a => <div key={a.id} className="flex items-start justify-between gap-4 border-t border-line py-3.5 text-[14.5px]"><span><b className="font-medium">{a.label}</b>{a.isDefault && ' (default)'}<br /><span className="font-light">{[a.line1, a.line2, a.city, a.pincode].filter(Boolean).join(', ')}</span></span><button className="text-[13px] text-muted" onClick={() => drop(a.id)}>Delete</button></div>)}
          {!addrs.length && !form && <p className="font-light text-muted">No saved addresses yet.</p>}
          {form && (
            <form onSubmit={save} className="mt-3 flex flex-col gap-3">
              <Field label="Label" required maxLength={40} value={form.label} onChange={e => setForm(s => ({ ...s, label: e.target.value }))} />
              <Field label="Address" required minLength={5} value={form.line1} onChange={e => setForm(s => ({ ...s, line1: e.target.value }))} />
              <div className="grid gap-3 sm:grid-cols-2"><Field label="City" required value={form.city} onChange={e => setForm(s => ({ ...s, city: e.target.value }))} /><Field label="PIN code" required pattern="[0-9]{6}" inputMode="numeric" maxLength={6} value={form.pincode} onChange={e => setForm(s => ({ ...s, pincode: e.target.value.replace(/\D/g, '') }))} /></div>
              <div className="flex gap-3"><Btn sm>SAVE</Btn><Btn sm ghost type="button" onClick={() => { setForm(null); setErr(''); }}>CANCEL</Btn></div>
            </form>
          )}
        </div>
        <div className="jaali grid items-center gap-6 p-7 text-ivory md:grid-cols-2">
          <div className="bg-maroon p-0.5"><span className="font-display text-[28px] font-medium">Trace a lot</span><p className="mt-1.5 text-sm font-light text-[#EADFD0]">Find the code on the back of any pack.</p></div>
          <div className="bg-maroon p-0.5"><LotTrace /></div>
        </div>
      </div>
    </div>
  );
}
