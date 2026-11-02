// Test-only tooling: copies the live Pantry catalogue (public, read-only GET) into a LOCAL throwaway backend.
// Writes only to http://localhost:5101 and refuses any other target. Never imported by the frontend.
//   ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/seed-local-from-live.mjs
// Credentials come from env vars only (the local test admin from the backend repo's test setup).
const LIVE = 'https://spoonupfoods.com/api/products'; // read-only GET
const LOCAL = process.env.LOCAL_API || 'http://localhost:5101';
const KEEP = ['Test Sold Out Honey']; // the sold-out fixture used for testing

if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(LOCAL)) throw new Error(`Refusing to write to ${LOCAL}: only localhost is allowed.`);
const { ADMIN_USERNAME: username, ADMIN_PASSWORD: password } = process.env;
if (!username || !password) throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD (local test admin).');

const call = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(LOCAL + path, { method, headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token && { 'x-admin-token': token }) }, body: body && JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status} ${data.error || ''}`);
  return data;
};

const live = (await (await fetch(LIVE)).json()).filter(p => p.fulfillmentKind === 'DELIVERY_IN_DAYS');
const { token } = await call('/api/admin/login', { method: 'POST', body: { username, password } });

for (const p of (await call('/api/products')).filter(p => p.fulfillmentKind === 'DELIVERY_IN_DAYS' && !KEEP.includes(p.name))) {
  await call(`/api/products/${p.id}`, { method: 'DELETE', token });
  console.log('removed', p.name);
}
for (const p of live) {
  // A size with no price (e.g. saffron 5g on live) cannot be created; it is skipped.
  const sizes = (p.sizes || []).filter(s => s.price != null).map(s => ({ label: s.label, price: s.price }));
  const body = { name: p.name, category: p.category, description: p.description, imageUrl: p.imageUrl, isAvailable: p.isAvailable, fulfillmentKind: 'DELIVERY_IN_DAYS', deliverLater: true, gstRate: p.gstRate, sizes, price: p.price };
  await call('/api/products', { method: 'POST', body, token });
  console.log('added', p.name, `(${sizes.length} sizes)`);
}
