# Kesar Mahal storefront

Never do the work yourself. Always hand it to a sub-agent.

Frontend for Kesar Mahal ("Treasures from Kashmir"), a Spoonup sub-brand selling Kashmiri saffron, dry fruits and kahwa. Built from the v2 mockup and brand guidelines in `~/Downloads/Kesar Mahal brand guidelines`.

## Stack

- React 18 + Vite 5 (JavaScript, JSX, no TypeScript)
- React Router 6 (`BrowserRouter`; routes in `src/App.jsx`)
- Tailwind CSS v4 via `@tailwindcss/vite`. Brand tokens (colours, fonts, `nav` breakpoint) live in the `@theme` block of `src/index.css`, which also holds the `jaali` pattern utilities. All styling is utility classes in JSX; no other CSS files and no UI library
- Google Fonts: Cinzel (labels), Cormorant Garamond (display), Jost (UI), JetBrains Mono (lot codes)
- State: React context in `src/store.jsx`; `localStorage` keys `km_bag`, `km_token`, `km_order_tokens`, `km_order_meta`, `km_gifts`

## Commands

- `npm install`
- `npm run dev` (http://localhost:5173)
- `npm run build` / `npm run preview`

## Layout

- `src/api.js`: the only module that calls the SpoonUp backend (base from `VITE_API_BASE`, headers `x-storefront` / `x-user-token` / `x-order-token`, error code to message map, guest order tokens in `localStorage`)
- `src/data.js`: `fmt`, shelf order, `adapt` (API product to UI product; drops sizes with a null/0 price, so a product with none is `unpriced` and unavailable), `statusInfo` (honest wording for every backend order status), gift boxes (`BOXES`, `giftNotes`), kesar `grades`, sample `lots` (demo only, not rendered)
- `src/store.jsx`: live catalogue (Pantry only: `fulfillmentKind === 'DELIVERY_IN_DAYS'`), bag (`{productId, sizeId, qty, gift?}` only, no prices), gift-box details, session user, `useQuote` (prices the bag via `POST /api/cart/quote`)
- `src/usePageMeta.js` + `src/site.js`: per-route title/description/canonical/OG tags; `SITE_URL` is `https://kesarmahal.com` (also in `index.html`, `public/robots.txt`, `public/sitemap.xml`)
- Hosting: Firebase Hosting, project `spoonup-508319`, target/site `kesarmahal` (`firebase.json`, `.firebaserc`); GitHub Actions deploy on push to `main`. Production builds read `VITE_API_BASE` from the committed `.env.production`. `vercel.json` / `public/_headers` are obsolete
- `src/components/`: `Chrome.jsx` (header/footer), `ui.jsx` (shared styled pieces: Btn, Label, Eyebrow, H1/H2, Photo, Badge, Arch, ProductCard, Skeleton, ErrorBox, Qty, Field, Line, Prose), `Summary.jsx` (server-quoted totals, `hasUnpriced` guard)
- `src/pages/`: one file per route (Home, Shop, Product, Gifting, Bag, Checkout, Confirmed, Account, Track, SignIn, Story, help and policy pages). Only Home, Shop, Product, Bag are in the main bundle; the rest are `React.lazy` in `src/App.jsx`
- `public/assets/`: logo, story image and the two product photos Story uses; `public/` also holds favicon PNGs, `robots.txt`, `sitemap.xml`
- `docs/GAPS.md`: launch audit with status per item; `docs/BACKEND-REQUESTS.md`: changes wanted in the SpoonUp backend (do not edit that repo from here)
- Dev: Vite proxies `/api` to `http://localhost:5101` (see `vite.config.js`). That backend uses a cloud database that may be real data: never sign up, check out or pay from the dev server

## Styling rules

- Use theme tokens (`bg-maroon`, `text-goldtext`, `border-line`, `font-display`, `font-cinzel`), not raw hex, except one-off arbitrary values. `gold` is for hairlines/decor only; small gold text on ivory uses `goldtext` (contrast), on dark grounds `gold2`.
- Repeated patterns become small components in `ui.jsx`, not `@apply` classes.
- Mobile first; layout switches at `lg` (1024px), header nav at the custom `nav` breakpoint (74rem).

## Brand rules

- Colours: Mahal Maroon `#6B1426`, Ivory `#F5F1EA`, Walnut Ink `#2A1E1A`, Zari Gold `#B08D57` (a thread, not a fill), accents Kesar `#C2431B`, Crocus `#8A5E9C`, Chinar Pine `#3D5240`. Category coding: Kesar = kesar, Dry fruits = gold, Kahwa = pine, Gifting = crocus.
- Cinzel is caps only, tracked wide; Cormorant for headlines and product names; Jost for body and buttons.
- Never lock the Kesar Mahal and Spoonup logos side by side; Spoonup appears only as "A Spoonup house".
- Don't stretch, recolour, rotate or crop the logo.

## Known stubs

- Payment: online (Razorpay, currently TEST keys on the connected backend) when `/api/settings` has `razorpayEnabled`; otherwise "pay on delivery" (`paymentMethod: counter`)
- Lot tracing: `lots` in `src/data.js` holds one sample lot and `LotTrace` in `Home.jsx` is not rendered; footer newsletter box does nothing
- No order email/SMS exists in the backend, so no copy may promise one. Track lists only orders saved on this device (no lookup by order number yet, see `docs/BACKEND-REQUESTS.md` #5)
- Eat Now, plans, referrals and store credit are intentionally absent; no Google sign-in unless the backend enables it
- Products without an `imageUrl` show the jaali placeholder; descriptions come from the API
- No shipping fee: the quote has none. Prices are GST-exclusive; GST comes from the quote
- Coupon discount is not in the order payload; the confirmation page shows it only on the device that placed it
- Contact/policy pages still hold `[to confirm]` placeholders; `npm run check:launch` fails while any remain
