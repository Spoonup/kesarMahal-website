import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { api, getUserToken, setUserToken } from './api';
import { adapt, sortShelf, lineKey } from './data';

const Ctx = createContext();
export const useStore = () => useContext(Ctx);

export const MAX_QTY = 50;
export const MAX_LINES = 50;

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const usePersist = (k, d) => {
  const [v, set] = useState(() => load(k, d));
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }, [k, v]);
  return [v, set];
};

export function StoreProvider({ children }) {
  // The bag holds only { productId, sizeId, qty }. Prices are never stored or sent.
  const [lines, setLines] = usePersist('km_bag', []);
  const [toast, setToast] = useState('');
  const [catalogue, setCatalogue] = useState({ status: 'loading', products: [], error: '' });
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!getUserToken());

  const say = msg => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const loadCatalogue = useCallback(() => {
    setCatalogue(c => ({ ...c, status: 'loading', error: '' }));
    api.products()
      .then(rows => setCatalogue({ status: 'ready', products: sortShelf(rows.map(adapt)), error: '' }))
      .catch(e => setCatalogue({ status: 'error', products: [], error: e.message }));
  }, []);
  useEffect(() => { loadCatalogue(); api.settings().then(setSettings).catch(() => setSettings({})); }, [loadCatalogue]);

  useEffect(() => {
    if (!getUserToken()) return;
    api.me().then(r => setUser(r.user)).catch(e => { if (e.status === 401) setUserToken(''); }).finally(() => setAuthReady(true));
  }, []);

  // Once the catalogue is known, drop bag lines whose product or size no longer exists or is sold out.
  const cleaned = useRef(false);
  useEffect(() => {
    if (catalogue.status !== 'ready' || cleaned.current) return;
    cleaned.current = true;
    const ok = l => { const p = catalogue.products.find(x => x.id === l.productId); return p?.available && p.sizes.some(s => s.id === l.sizeId); };
    if (lines.some(l => !ok(l))) { setLines(cur => cur.filter(ok)); say('Some items are no longer available and were removed from your bag'); }
  }, [catalogue, lines, setLines]);

  const byId = id => catalogue.products.find(p => p.id === id);

  const add = (p, size, qty = 1) => {
    const key = lineKey(p.id, size.id);
    const hit = lines.find(l => lineKey(l.productId, l.sizeId) === key);
    if (!hit && lines.length >= MAX_LINES) return say(`A bag holds at most ${MAX_LINES} different items`);
    setLines(cur => hit
      ? cur.map(l => (l === hit ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...cur, { productId: p.id, sizeId: size.id, qty: Math.min(MAX_QTY, qty) }]);
    say(`${p.name}${size.label ? ` (${size.label})` : ''} added to bag`);
  };
  const setQty = (key, qty) => setLines(cur => cur.map(l => (lineKey(l.productId, l.sizeId) === key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l)));
  const remove = key => setLines(cur => cur.filter(l => lineKey(l.productId, l.sizeId) !== key));
  const clear = () => setLines([]);
  const count = lines.reduce((a, l) => a + l.qty, 0);

  const signIn = ({ token, user: u }) => { setUserToken(token); setUser(u); setAuthReady(true); };
  const signOut = () => { api.logout(); setUserToken(''); setUser(null); };

  return (
    <Ctx.Provider value={{ lines, add, setQty, remove, clear, count, catalogue, loadCatalogue, byId, settings, user, authReady, signIn, signOut, toast }}>
      {children}
    </Ctx.Provider>
  );
}

// Prices the bag on the server (never locally). Re-quotes whenever the bag or coupon changes.
export function useQuote(couponCode, phone) {
  const { lines } = useStore();
  const [state, setState] = useState({ status: lines.length ? 'loading' : 'idle', quote: null, error: null });
  const sig = JSON.stringify(lines) + '|' + (couponCode ? `${couponCode}|${phone}` : '');
  useEffect(() => {
    if (!lines.length) { setState({ status: 'idle', quote: null, error: null }); return; }
    let live = true;
    setState(s => ({ ...s, status: 'loading' }));
    api.quote(lines.map(l => ({ id: l.productId, sizeId: l.sizeId, quantity: l.qty })), couponCode, phone)
      .then(quote => live && setState({ status: 'ready', quote, error: null }))
      .catch(error => live && setState({ status: 'error', quote: null, error }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return state;
}
