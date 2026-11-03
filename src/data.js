export const fmt = n => { const v = Number(n || 0); const d = Number.isInteger(v) ? 0 : 2; return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d }); };

const G = '#B08D57';
const KESAR = '#C2431B';
const PINE = '#3D5240';

// Shop shelves (display level only; backend category strings are untouched). SHELF_OF maps a backend category
// to its shelf; EVERY category not listed lands in the catch-all shelf, so a category the
// owner adds later never adds a filter. Shelf order = SHELVES order.
export const SHELVES = ['Dry Fruits & Berries', 'Kesar', 'Honey', 'Kahwa', 'Pantry', 'Wellness'];
export const CATCH_ALL = 'Pantry';
const SHELF_OF = {
  'Dry Fruits': 'Dry Fruits & Berries', 'Kashmiri Dry Fruits': 'Dry Fruits & Berries', 'Dried Berries': 'Dry Fruits & Berries',
  Kesar: 'Kesar', Saffron: 'Kesar', Honey: 'Honey', Kahwa: 'Kahwa',
  Spices: 'Pantry', Seeds: 'Pantry', Oils: 'Pantry', Food: 'Pantry', 'Healthy Breakfast': 'Pantry',
  Beauty: 'Wellness', Health: 'Wellness'
};
export const shelfOf = c => SHELF_OF[c] || CATCH_ALL;
// Deep links (/shop?category=Honey, ?category=Spices, ?category=Dry Fruits & Berries): a shelf name or a mapped
// category resolves to its shelf; anything else is 'All'.
export const resolveShelf = c => (SHELVES.includes(c) ? c : SHELF_OF[c] || 'All');
const rank = c => SHELVES.indexOf(c);
export const categoryColor = shelf => (shelf === 'Kesar' ? KESAR : shelf === 'Kahwa' || shelf === CATCH_ALL ? PINE : G);

export const sortShelf = list => [...list].sort((a, b) => rank(a.room) - rank(b.room) || a.category.localeCompare(b.category));
// Shelves in order, for the nav, footer and Home.
export const categoriesOf = list => SHELVES.filter(s => list.some(p => p.room === s));

// Gifting page: live products suited to gifting, in display order. Matched by exact live name; a name that is
// not in the live catalogue, is sold out, or has no price (e.g. unseeded local test data) is skipped. No prices here: they always come from the API.
export const GIFTING = ['Kashmiri Mongra Saffron (Pure)', 'Kashmiri Mamra Almonds', 'Kashmiri Walnut Kernels', 'Mixed Dry Fruits', 'Roasted Fruit & Nut', 'Dried Fig (Anjeer)', 'Saffron Honey', 'Kashmiri Gulkand'];
export const giftsOf = live => GIFTING.map(n => live.find(p => p.name === n && p.available && p.sizes.every(z => z.price > 0))).filter(Boolean);

// Server product -> what the UI uses. `sizes` is always non-empty; an unsized product gets one price-only entry.
export const adapt = p => {
  const sized = p.sizes?.length;
  return {
    id: p.id, name: p.name, category: p.category || 'Pantry', room: shelfOf(p.category), desc: p.description || '', img: p.imageUrl || '',
    available: p.isAvailable !== false, color: categoryColor(shelfOf(p.category)), sized,
    sizes: sized ? p.sizes.map(s => ({ id: s.id, label: s.label, price: Number(s.price) })) : [{ id: undefined, label: '', price: Number(p.price) }]
  };
};

// Shelves in order that hold at least one product.
export const roomsOf = live => SHELVES.filter(r => live.some(p => p.room === r));

export const lineKey = (productId, sizeId) => `${productId}|${sizeId ?? ''}`;
// Bag line identity: gift-box lines are kept apart from a normal line of the same product.
export const bagKey = l => lineKey(l.productId, l.sizeId) + (l.gift ? `|${l.gift}` : '');

// Gift boxes. The box fee is a real catalogue product the owner creates in the SpoonUp admin (see docs/GIFT-BOXES.md),
// found by exact name. `price` is the admin reference only: it is never shown or charged, the server quote is.
export const BOXES = [
  { key: 'Shikara', n: 3, product: 'Gift Box - Shikara', price: 250 },
  { key: 'Chinar', n: 4, product: 'Gift Box - Chinar', price: 350 },
  { key: 'Mahal', n: 6, product: 'Gift Box - Mahal', price: 500 }
];
export const BOX_COLOURS = [{ name: 'Maroon', hex: '#6B1426' }, { name: 'Ivory', hex: '#F5F1EA' }];
export const NOTE_MAX = 120;
const GIFT_ROOMS = ['Dry Fruits & Berries', 'Honey', 'Kesar'];
const priced = p => p.available && p.sizes.some(z => z.price > 0);
// Gift-box fee products are for /gifting only: the shop grid and Home leave them out.
export const isBox = p => BOXES.some(b => b.product === p.name);
export const boxProductOf = (live, box) => live.find(p => p.name === box.product && priced(p));
// Treasures a box can hold: the GIFTING picks first, then other orderable dry fruits, honey and saffron.
export const treasuresOf = live => {
  const first = GIFTING.map(n => live.find(p => p.name === n && priced(p))).filter(Boolean);
  return [...first, ...live.filter(p => GIFT_ROOMS.includes(p.room) && priced(p) && !first.includes(p) && !BOXES.some(b => b.product === p.name))];
};

// Order notes (<= 250 chars) for the gift boxes in the bag: the structure is kept, only the notes are cut.
export const giftNotes = (lines, gifts) => {
  const ids = [...new Set(lines.map(l => l.gift).filter(id => gifts[id]))];
  let room = 250 - ids.map(id => `Gift box: ${gifts[id].tier}, ${gifts[id].colour}.`).join(' | ').length - ids.length * 8;
  return ids.map(id => {
    const g = gifts[id], note = (g.note || '').trim().slice(0, Math.max(0, room));
    room -= note.length;
    return `Gift box: ${g.tier}, ${g.colour}.${note ? ` Note: ${note}` : ''}`;
  }).join(' | ').slice(0, 250);
};

export const grades = [
  { name: 'Mongra', tag: 'Finest', bar: '100%', d: 'Only the deep-red stigma tips. Strongest colour and aroma.', use: 'For kahwa, phirni, biryani' },
  { name: 'Lacha', tag: 'Classic', bar: '70%', d: 'Stigma with a little yellow style attached. Gentler, everyday.', use: 'For milk, sweets, daily cooking' },
  { name: 'Pushal', tag: 'Whole', bar: '45%', d: 'Loose whole threads with more style. Mild, economical.', use: 'For bulk cooking & infusions' }
];
// Only lot in the mockup; replace with an API lookup.
export const lots = { 'KM-PMP-2611': { product: 'Mongra Kesar', picked: '12 Oct 2026', grower: 'Bhat family, Pampore' } };
