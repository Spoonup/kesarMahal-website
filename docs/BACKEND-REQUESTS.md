# Backend requests (SpoonUp API)

Things the Kesar Mahal storefront would like changed in the backend. Nothing here was edited in the backend repo.

1. **Test-mode payment completion from a browser.** `POST /api/checkout/prepare` with `paymentMethod: "online"` works without Razorpay keys (returns a fake `order_test_...` id), but `POST /api/checkout/complete` then needs `razorpaySignature` = HMAC with `RAZORPAY_KEY_SECRET`, which a frontend must never hold. Locally the storefront therefore falls back to `paymentMethod: "counter"` (unpaid, pay on delivery). Suggest: when `NODE_ENV=test`, accept a documented dummy signature (e.g. `test_signature`) in `/checkout/complete`, so the online path can be exercised end to end.
2. **Coupon discount missing from the order.** `GET /api/orders/:id` and `GET /api/me/orders` return `totalAmount` before the coupon discount; the discount and `payableTotal` exist only on the parent order, which customers cannot fetch. The storefront stores them from the `/checkout/complete` response (this device only). Suggest adding `couponDiscount` and `payableTotal` to the public order payload.
3. **Coupons need an identity.** `/api/coupons/validate` and `/api/cart/quote` answer `COUPON_NEEDS_IDENTITY` for guests unless a phone is sent (`phone` / `customerPhone`). Works, but undocumented in the quote request shape.
4. **Shipping charge.** `/api/cart/quote` returns no shipping fee, so the storefront shows "India-wide" and charges none. If Pantry shipping should have a fee or free-shipping threshold, it needs to come from the server totals.
5. **Order access for guests on a new device.** A guest can only reopen an order with the `x-order-token` stored in the browser that placed it. A "look up my order" flow (order number + phone, or an emailed link) would help.
6. **CORS for production.** If the API is served from a different origin than the storefront, `ALLOWED_ORIGINS` (or equivalent) must include the storefront domain.

## Catalogue for the SpoonUp admin

`docs/catalogue-for-admin.csv` lists the 55 "coming soon" products (id, name, sub, room, size label, supplier price) from the supplier's public store (kesarlandmart.com). The prices are reference only: set Kesar Mahal's own prices when entering products in the admin. Once a product is live in the admin, remove or hide its row in `src/catalogue.json` (or add it to `src/liveTwin.json` with its exact live name).

7. **Saffron 5g size has no price on live.** `Kashmiri Mongra Saffron (Pure)` returns a size `5g` with `price: null`; the admin should fix it. 'Kashmir ke Blackberries (100% Pure)' has no sizes and is sold out.

8. **Honour `x-storefront: kesarmahal`.** Every storefront call now sends this header. `GET /api/products` (and `/api/cart/quote`, `/api/checkout/prepare`) should honour it: return only `DELIVERY_IN_DAYS` items, and reject any other product with code `NOT_AVAILABLE_ON_STOREFRONT`. The local backend currently returns 37 products (32 Pantry + 5 Eat Now) with or without the header; the storefront keeps a client-side `DELIVERY_IN_DAYS` filter as a safety net.

9. **Contact form endpoint.** The /contact page has no API to post to, so the form opens a prefilled `mailto:` to the support email. Suggest `POST /api/contact` `{ name, email, phone?, orderNumber?, message }` (rate-limited, emails support), after which the form can send in place.
