import catalogue from './catalogue.json';
export const fmt = n => '₹' + n.toLocaleString('en-IN');
export const FREE_SHIP = 999;
export const SPOONUP_CREDIT = 150;

const G = '#B08D57';

// Catalogue rows (src/catalogue.json) come from kesarlandmart.com: name, category, size → price.
// Brand extras (photo, grade badge, copy, gift-box eligibility) are layered on by site id below.
const extras = {
  5558: { id: 'alm', grade: 'Mamra', img: 'almond', gift: 1, desc: 'Small orchards around Budgam, sun-dried in their shells and graded by hand for size and oil content.' },
  5518: { id: 'wal', grade: 'Kagzi', img: 'walnut', gift: 1, desc: 'Paper-shell walnuts from Kulgam, cracked and sorted into light, sweet kernels.' },
  5493: { id: 'saf', grade: 'Mongra', img: '', gift: 1, tagline: 'Kashmiri saffron · stigma tips only · Pampore', iso: 'ISO 3632 Category I', desc: 'The deep-red tips of the crocus stigma, with none of the yellow style left on. Three or four threads colour a whole pot of kahwa.' },
  5656: { id: 'mix', grade: 'Roasted', img: 'mix', desc: 'A roasted mix of nuts and berries, made for the gift tray.' },
  5620: { id: 'fig', grade: 'Select', img: 'fig', gift: 1, desc: 'Soft, sun-dried figs with a honeyed centre.' },
  5742: { id: 'dat', grade: 'Medjool', img: 'dates', gift: 1, desc: 'Large, soft dates with a caramel finish.' },
  5734: { id: 'cas', grade: 'W240', img: 'cashew', gift: 1, desc: 'Whole W240 cashews, creamy and lightly sweet.' },
  5604: { id: 'hny', grade: 'Raw', img: 'honey', gift: 1, desc: 'Raw single-flower acacia honey from the Kashmir hills. Clear, mild and slow to set.' },
  5763: { id: 'kkh', grade: 'Kesar', gift: 1, desc: 'Green tea, cardamom, cinnamon and saffron, with almond to finish. Brew in a samovar or a pot.' },
  5563: { id: 'cra', grade: 'Whole', img: 'cranberry' },
  5574: { id: 'plm', grade: 'Whole', img: 'plum' },
  5567: { id: 'blk', grade: 'Whole', img: 'blackberry' }
};

// Category colour coding from the brand guide; rooms beyond the original four reuse the accents.
export const roomColor = { 'Dry Fruits': G, Kesar: '#C2431B', Kahwa: '#3D5240', Honey: G, Seeds: G, Spices: '#C2431B', Oils: '#3D5240', Beauty: '#8A5E9C', Health: '#3D5240' };
export const roomList = ['Dry Fruits', 'Kesar', 'Kahwa', 'Honey', 'Seeds', 'Spices', 'Oils', 'Beauty', 'Health'];

export const products = catalogue.map(r => {
  const x = extras[r.id] || {};
  return {
    id: x.id || 'p' + r.id, room: r.room, grade: x.grade || r.room, name: r.name, sub: r.sub, color: roomColor[r.room],
    img: x.img || '', sizes: r.sizes, unit: r.sizes[0][0], gift: x.gift ? r.sizes[0] : undefined,
    desc: x.desc, tagline: x.tagline, iso: x.iso
  };
});
export const byId = id => products.find(p => p.id === id);
export const imgSrc = p => (p.img ? `/assets/products/${p.img}.png` : '');

export const boxes = [{ name: 'Shikara', n: 3, price: 250 }, { name: 'Chinar', n: 4, price: 350 }, { name: 'Mahal', n: 6, price: 500 }];
export const colours = [{ name: 'Maroon', hex: '#6B1426' }, { name: 'Ivory', hex: '#E9E0CF' }];
export const treasures = products.filter(p => p.gift);

export const rooms = [
  { id: 'df', name: 'Dry Fruits', line: 'Almonds, walnuts, figs, dates, honey', color: G, img: '/assets/products/mix.png', to: '/shop?room=Dry%20Fruits' },
  { id: 'ks', name: 'Kesar', line: 'Mongra & Lacha saffron', color: '#C2431B', to: '/shop?room=Kesar' },
  { id: 'kh', name: 'Kahwa', line: 'Teas & samovar blends', color: '#3D5240', to: '/shop?room=Kahwa' },
  { id: 'gf', name: 'Gifting', line: 'Boxes for Eid, Diwali & weddings', color: '#8A5E9C', to: '/gift' }
];
export const grades = [
  { name: 'Mongra', tag: 'Finest', bar: '100%', d: 'Only the deep-red stigma tips. Strongest colour and aroma.', use: 'For kahwa, phirni, biryani' },
  { name: 'Lacha', tag: 'Classic', bar: '70%', d: 'Stigma with a little yellow style attached. Gentler, everyday.', use: 'For milk, sweets, daily cooking' },
  { name: 'Pushal', tag: 'Whole', bar: '45%', d: 'Loose whole threads with more style. Mild, economical.', use: 'For bulk cooking & infusions' }
];
// Only lot in the mockup; replace with an API lookup.
export const lots = { 'KM-PMP-2611': { product: 'Mongra Kesar', picked: '12 Oct 2026', grower: 'Bhat family, Pampore' } };
