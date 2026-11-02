import { createContext, useContext, useEffect, useState } from 'react';
import { FREE_SHIP, SPOONUP_CREDIT } from './data';

const Ctx = createContext();
export const useStore = () => useContext(Ctx);

const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const usePersist = (k, d) => {
  const [v, set] = useState(() => load(k, d));
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }, [k, v]);
  return [v, set];
};

export function StoreProvider({ children }) {
  const [items, setItems] = usePersist('km_bag', []);
  const [useCredit, setUseCredit] = usePersist('km_credit', true);
  const [user, setUser] = usePersist('km_user', null);
  const [orders, setOrders] = usePersist('km_orders', []);
  const [toast, setToast] = useState('');

  const add = item => {
    setItems(cur => {
      const hit = cur.find(i => i.key === item.key && i.kind !== 'gift');
      return hit ? cur.map(i => (i === hit ? { ...i, qty: i.qty + item.qty } : i)) : [...cur, item];
    });
    setToast(`${item.name} added to bag`);
    setTimeout(() => setToast(''), 2200);
  };
  const setQty = (key, qty) => setItems(cur => cur.map(i => (i.key === key ? { ...i, qty: Math.max(1, Math.min(9, qty)) } : i)));
  const remove = key => setItems(cur => cur.filter(i => i.key !== key));

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const credit = user && useCredit && items.length ? Math.min(SPOONUP_CREDIT, subtotal) : 0;
  const placeOrder = ({ shipping, shipFee, form }) => {
    const order = {
      id: 'KM-' + (20000 + Math.floor(Math.random() * 9000)), placed: new Date().toISOString(),
      items, subtotal, shipFee, credit, total: subtotal + shipFee - credit, shipping, name: form.name, city: form.city
    };
    setOrders(o => [order, ...o]);
    setItems([]);
    return order;
  };

  return (
    <Ctx.Provider value={{ items, add, setQty, remove, count, subtotal, credit, useCredit, setUseCredit, user, setUser, orders, placeOrder, toast, freeShip: subtotal >= FREE_SHIP }}>
      {children}
    </Ctx.Provider>
  );
}
