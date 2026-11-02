// The only module that talks to the SpoonUp backend. Prices always come from the server.
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export const getUserToken = () => read('km_token', '');
export const setUserToken = t => write('km_token', t || '');
// Guest access to an order is only possible with the token the server returned when it was placed.
export const getOrderToken = id => read('km_order_tokens', {})[id] || '';
export const rememberOrder = (o, parent) => {
  write('km_order_tokens', { ...read('km_order_tokens', {}), [o.id]: o.accessToken });
  // GET /api/orders/:id does not return the coupon discount, so keep what /checkout/complete told us.
  if (parent?.couponDiscount > 0) write('km_order_meta', { ...read('km_order_meta', {}), [o.id]: { discount: parent.couponDiscount, payable: parent.payableTotal } });
};
export const getOrderMeta = id => read('km_order_meta', {})[id];

const MESSAGES = {
  INVALID_PINCODE: 'Enter a valid 6-digit pincode.',
  INVALID_PHONE: 'Enter a valid 10-digit Indian mobile number.',
  EMAIL_REQUIRED: 'Please enter your email address.',
  INVALID_EMAIL: 'That email address does not look right.',
  PRODUCT_SOLD_OUT: 'One of the items in your bag is sold out. Remove it to continue.',
  PRODUCT_NOT_FOUND: 'One of the items in your bag is no longer available. Remove it to continue.',
  INVALID_SIZE: 'That pack size is no longer available.',
  EMPTY_CART: 'Your bag is empty.',
  CART_TOO_LARGE: 'A bag can hold at most 50 different items.',
  CHECKOUT_EXPIRED: 'This checkout expired. Please try again.',
  COUPON_NOT_FOUND: 'That coupon code is not valid.',
  COUPON_EXPIRED: 'That coupon has expired.',
  COUPON_INACTIVE: 'That coupon is not active.',
  COUPON_NOT_STARTED: 'That coupon is not active yet.',
  COUPON_EXHAUSTED: 'That coupon has been fully used.',
  COUPON_ALREADY_USED: 'You have already used that coupon.',
  COUPON_MIN_ORDER: 'Your order is below the minimum for that coupon.',
  COUPON_NOT_APPLICABLE: 'That coupon does not apply to the items in your bag.',
  COUPON_NEEDS_IDENTITY: 'Enter your mobile number or sign in to use that coupon.',
  INVALID_COUPON: 'That coupon code is not valid.',
  GATEWAY_UNAVAILABLE: 'That payment method is not available.',
  PAYMENT_AMOUNT_MISMATCH: 'The payment did not match the order total. Please contact us.',
  NOT_AVAILABLE_ON_STOREFRONT: 'That item is not sold on this store. Remove it from your bag to continue.'
};
export const friendly = e => MESSAGES[e?.code] || e?.message || 'Something went wrong. Please try again.';

async function request(path, { method = 'GET', body, orderToken } = {}) {
  const headers = { 'x-storefront': 'kesarmahal' };
  if (body) headers['Content-Type'] = 'application/json';
  const user = getUserToken();
  if (user) headers['x-user-token'] = user;
  if (orderToken) headers['x-order-token'] = orderToken;
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw Object.assign(new Error('Could not reach the store. Check your connection and try again.'), { code: 'NETWORK' });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Request failed (${res.status})`), { status: res.status, code: data.code });
  return data;
}
const post = (path, body) => request(path, { method: 'POST', body });

export const api = {
  settings: () => request('/api/settings'),
  // Kesar Mahal sells only the Pantry range: products shipped in days, anywhere in India.
  products: async () => (await request('/api/products')).filter(p => p.fulfillmentKind === 'DELIVERY_IN_DAYS'),
  // Send ids and quantities only; the server returns every price, GST amount and total.
  quote: (lines, couponCode, customerPhone) => post('/api/cart/quote', { lines, ...(couponCode ? { couponCode, customerPhone } : {}) }),
  validateCoupon: (code, lines, phone) => post('/api/coupons/validate', { code, lines, phone }),
  prepare: body => post('/api/checkout/prepare', body),
  complete: body => post('/api/checkout/complete', body),
  abandon: checkoutId => post('/api/checkout/abandon', { checkoutId }).catch(() => ({})),
  order: id => request(`/api/orders/${encodeURIComponent(id)}`, { orderToken: getOrderToken(id) }),
  signup: body => post('/api/auth/signup', body),
  login: body => post('/api/auth/login', body),
  logout: () => post('/api/auth/logout').catch(() => ({})),
  me: () => request('/api/auth/me'),
  myOrders: () => request('/api/me/orders'),
  addresses: () => request('/api/me/addresses'),
  addAddress: body => post('/api/me/addresses', body),
  deleteAddress: id => request(`/api/me/addresses/${id}`, { method: 'DELETE' })
};
