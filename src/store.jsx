import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { api, getUserToken, setUserToken } from './api';
import { adapt, sortShelf, lineKey, bagKey } from './data';

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
  // Gift-box details (tier, colour, note) by group id; the box's bag lines carry `gift: id`. Never prices.
  const [gifts, setGifts] = usePersist('km_gifts', {});
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
    const bad = new Set(lines.filter(l => l.gift && !ok(l)).map(l => l.gift)); // a gift box is all or nothing
    const keep = l => ok(l) && !bad.has(l.gift);
    if (lines.some(l => !keep(l))) { setLines(cur => cur.filter(keep)); say('Some items are no longer available and were removed from your bag'); }
  }, [catalogue, lines, setLines]);

  const byId = id => catalogue.products.find(p => p.id === id);

  const add = (p, size, qty = 1) => {
    const key = lineKey(p.id, size.id);
    const hit = lines.find(l => !l.gift && lineKey(l.productId, l.sizeId) === key);
    if (!hit && lines.length >= MAX_LINES) return say(`A bag holds at most ${MAX_LINES} different items`);
    setLines(cur => hit
      ? cur.map(l => (l === hit ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
      : [...cur, { productId: p.id, sizeId: size.id, qty: Math.min(MAX_QTY, qty) }]);
    say(`${p.name}${size.label ? ` (${size.label})` : ''} added to bag`);
  };
  const setQty = (key, qty) => setLines(cur => cur.map(l => (bagKey(l) === key ? { ...l, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : l)));
  const remove = key => setLines(cur => cur.filter(l => bagKey(l) !== key));
  // items: [{ p, size }]; the box product comes first. Added together or not at all.
  const addGift = (meta, items) => {
    if (lines.length + items.length > MAX_LINES) { say(`A bag holds at most ${MAX_LINES} different items`); return false; }
    const id = 'g' + Date.now().toString(36);
    setGifts(g => ({ ...g, [id]: meta }));
    setLines(cur => [...cur, ...items.map(({ p, size }) => ({ productId: p.id, sizeId: size.id, qty: 1, gift: id }))]);
    say(`${meta.tier} gift box added to bag`);
    return true;
  };
  const removeGift = id => { setLines(cur => cur.filter(l => l.gift !== id)); setGifts(({ [id]: _, ...rest }) => rest); };
  const clear = () => { setLines([]); setGifts({}); };
  const count = lines.reduce((a, l) => a + l.qty, 0);

  const signIn = ({ token, user: u }) => { setUserToken(token); setUser(u); setAuthReady(true); };
  const signOut = () => { api.logout(); setUserToken(''); localStorage.removeItem('km_order_tokens'); localStorage.removeItem('km_order_meta'); setUser(null); };
  useEffect(() => { const h = () => setUser(null); window.addEventListener('km:unauthorized', h); return () => window.removeEventListener('km:unauthorized', h); }, []);

  return (
    <Ctx.Provider value={{ lines, gifts, addGift, removeGift, add, setQty, remove, clear, count, catalogue, loadCatalogue, byId, settings, user, authReady, signIn, signOut, toast }}>
      {children}
    </Ctx.Provider>
  );
}

// Prices the bag on the server (never locally). Re-quotes whenever the bag or coupon changes.
// `override` prices a would-be set of lines (the gift builder) instead of the bag.
export function useQuote(couponCode, phone, override) {
  const { lines: bag } = useStore();
  const lines = override || bag;
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
