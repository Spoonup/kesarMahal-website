export const fmt = n => { const v = Number(n || 0); const d = Number.isInteger(v) ? 0 : 2; return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }); };

import supplier from './catalogue.json';
import liveTwin from './liveTwin.json';

const G = '#B08D57';
const KESAR = '#C2431B';
const PINE = '#3D5240';

// Shelf order for the live Pantry catalogue; unknown categories follow alphabetically.
export const CATEGORY_ORDER = ['Dry Fruits', 'Kashmiri Dry Fruits', 'Dried Berries', 'Honey', 'Saffron', 'Healthy Breakfast', 'Food'];
const rank = c => { const i = CATEGORY_ORDER.indexOf(c); return i < 0 ? CATEGORY_ORDER.length : i; };
export const categoryColor = c => (c === 'Saffron' ? KESAR : c === 'Healthy Breakfast' || c === 'Food' ? PINE : G);

export const sortShelf = list => [...list].sort((a, b) => rank(a.category) - rank(b.category) || a.category.localeCompare(b.category));
export const categoriesOf = list => [...new Set(sortShelf(list).map(p => p.category).filter(Boolean))];

// Server product -> what the UI uses. `sizes` is always non-empty; an unsized product gets one price-only entry.
export const adapt = p => {
  const sized = p.sizes?.length;
  return {
    id: p.id, name: p.name, category: p.category || 'Pantry', room: ROOM_OF[p.category] || p.category || 'Pantry', desc: p.description || '', img: p.imageUrl || '',
    available: p.isAvailable !== false, color: categoryColor(p.category), sized,
    sizes: sized ? p.sizes.map(s => ({ id: s.id, label: s.label, price: Number(s.price) })) : [{ id: undefined, label: '', price: Number(p.price) }]
  };
};

// Room (shop filter) for a live category; categories not listed are their own room.
const ROOM_OF = { 'Kashmiri Dry Fruits': 'Dry Fruits', 'Dried Berries': 'Dry Fruits', Saffron: 'Kesar' };
const roomColor = r => (r === 'Kesar' ? KESAR : r === 'Kahwa' || r === 'Healthy Breakfast' || r === 'Food' ? PINE : G);
const ROOMS = ['Dry Fruits', 'Kesar', 'Kahwa', 'Honey', 'Seeds', 'Spices', 'Oils', 'Beauty', 'Health'];

// Coming-soon items: facts only (name, sizes) from the supplier snapshot in catalogue.json. Supplier prices are
// reference for the owner, never shown or sold; these items never enter the bag. Same ids as the CSV in docs/.
// A snapshot row is hidden when the live shop has the same product: supplier id -> exact live name
// (liveTwin.json, verified against spoonupfoods.com; see docs/LIVE-MATCH.md). Unmatched rows stay "Coming soon".
export const soonItems = live => supplier
  .filter(r => !(liveTwin[r.id] && live.some(p => p.name === liveTwin[r.id])))
  .map(r => ({ id: String(r.id), name: r.name, sub: r.sub, room: r.room, color: roomColor(r.room), sizes: r.sizes.map(z => z[0]).filter(Boolean), soon: true }));
// Chips: live rooms in live shelf order, then the remaining rooms.
export const roomsOf = (live, soon) => [...new Set([...live.map(p => p.room), ...ROOMS, ...soon.map(p => p.room)])].filter(r => live.some(p => p.room === r) || soon.some(p => p.room === r));

export const lineKey = (productId, sizeId) => `${productId}|${sizeId ?? ''}`;

export const grades = [
  { name: 'Mongra', tag: 'Finest', bar: '100%', d: 'Only the deep-red stigma tips. Strongest colour and aroma.', use: 'For kahwa, phirni, biryani' },
  { name: 'Lacha', tag: 'Classic', bar: '70%', d: 'Stigma with a little yellow style attached. Gentler, everyday.', use: 'For milk, sweets, daily cooking' },
  { name: 'Pushal', tag: 'Whole', bar: '45%', d: 'Loose whole threads with more style. Mild, economical.', use: 'For bulk cooking & infusions' }
];
// Only lot in the mockup; replace with an API lookup.
export const lots = { 'KM-PMP-2611': { product: 'Mongra Kesar', picked: '12 Oct 2026', grower: 'Bhat family, Pampore' } };
