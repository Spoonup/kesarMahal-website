# Kesar Mahal storefront

Never do the work yourself. Always hand it to a sub-agent.

Frontend for Kesar Mahal ("Treasures from Kashmir"), a Spoonup sub-brand selling Kashmiri saffron, dry fruits and kahwa. Built from the v2 mockup and brand guidelines in `~/Downloads/Kesar Mahal brand guidelines`.

## Stack

- React 18 + Vite 5 (JavaScript, JSX, no TypeScript)
- React Router 6 (`BrowserRouter`; routes in `src/App.jsx`)
- Tailwind CSS v4 via `@tailwindcss/vite`. Brand tokens (colours, fonts, `nav` breakpoint) live in the `@theme` block of `src/index.css`, which also holds the `jaali` pattern utilities. All styling is utility classes in JSX; no other CSS files and no UI library
- Google Fonts: Cinzel (labels), Cormorant Garamond (display), Jost (UI), JetBrains Mono (lot codes)
- State: React context in `src/store.jsx`; `localStorage` keys `km_bag`, `km_token`, `km_order_tokens`, `km_order_meta`

## Commands

- `npm install`
- `npm run dev` (http://localhost:5173)
- `npm run build` / `npm run preview`

## Layout

- `src/api.js`: the only module that calls the SpoonUp backend (base from `VITE_API_BASE`, headers `x-storefront: kesarmahal` (sent on every call) / `x-user-token` / `x-order-token`, error code to message map, guest order tokens in `localStorage`)
- `src/liveTwin.json`: supplier id -> exact live product name; hides that coming-soon row when the live shop has it (see `docs/LIVE-MATCH.md`)
- `scripts/seed-local-from-live.mjs`: test-only; copies live Pantry products into the LOCAL backend (localhost only, creds from env)
- `src/data.js`: `fmt`, shelf order (`CATEGORY_ORDER`), `adapt` (API product to UI product), kesar `grades`, sample `lots`
- `src/catalogue.json` + `docs/catalogue-for-admin.csv`: 55 "coming soon" products (name, sub, room, size labels, supplier prices) re-pulled as facts only from the supplier kesarlandmart.com's public Store API (no images/descriptions). `soonItems` in `data.js` hides rows that a live product duplicates (`LIVE_TWIN`). Shown by `SoonCard` and `pages/Soon.jsx` at `/coming-soon/:id`; never in the bag or quote
- `src/store.jsx`: live catalogue (Pantry only: `fulfillmentKind === 'DELIVERY_IN_DAYS'`), bag (`{productId, sizeId, qty}` only, no prices), session user, `useQuote` (prices the bag via `POST /api/cart/quote`)
- `src/components/`: `Chrome.jsx` (header/footer), `ui.jsx` (shared styled pieces: Btn, Label, Eyebrow, H1/H2, Photo, Badge, Arch, ProductCard, Skeleton, ErrorBox, Qty, Field, Line), `Summary.jsx` (server-quoted totals), `ErrorBoundary.jsx` (branded fallback with Reload, wraps `<App/>` in `main.jsx`)
- `src/pages/`: one file per route (Shop, Product, Bag, Checkout, Confirmed, SignIn, Account, Home, Story, plus help pages Contact, Shipping, Returns, Faq, Storage, Track, Privacy, Terms). Text pages use `Prose` from `ui.jsx`; draft copy has `[to confirm]` tokens for the owner
- `src/contact.js`: `CONTACT` (support email from the SpoonUp site; phone, address, hours are placeholders to fill) and `mailto()`. The Contact form opens a prefilled mailto (no backend endpoint; see BACKEND-REQUESTS #9)
- `vercel.json` + `public/_redirects`: SPA fallback to `index.html` for Vercel / Netlify-style hosts (no `/api` rewrite; routing undecided)
- `public/assets/`: logo and product images; `story/dal-lake.jpg` is a third-party photo, licence unconfirmed (`docs/IMAGE-CREDITS.md`)
- `docs/BACKEND-REQUESTS.md`: changes wanted in the SpoonUp backend (do not edit that repo from here)
- Dev: Vite proxies `/api` to `http://localhost:5101` (see `vite.config.js`)

## Styling rules

- Use theme tokens (`bg-maroon`, `text-gold`, `border-line`, `font-display`, `font-cinzel`), not raw hex, except one-off arbitrary values.
- Repeated patterns become small components in `ui.jsx`, not `@apply` classes.
- Mobile first; layout switches at `lg` (1024px), header nav at the custom `nav` breakpoint (74rem).

## Brand rules

- Colours: Mahal Maroon `#6B1426`, Ivory `#F5F1EA`, Walnut Ink `#2A1E1A`, Zari Gold `#B08D57` (a thread, not a fill), accents Kesar `#C2431B`, Crocus `#8A5E9C`, Chinar Pine `#3D5240`. Category coding: Kesar = kesar, Dry fruits = gold, Kahwa = pine, Gifting = crocus.
- Cinzel is caps only, tracked wide; Cormorant for headlines and product names; Jost for body and buttons.
- Never lock the Kesar Mahal and Spoonup logos side by side; Spoonup appears only as "A Spoonup house".
- Don't stretch, recolour, rotate or crop the logo.

## Known stubs

- Coming-soon items show no price (supplier prices are reference only; the owner sets their own in the SpoonUp admin). Remove a row from `catalogue.json` once the product is live

- Payment: online (Razorpay) only when `/api/settings` has `razorpayEnabled`; otherwise "pay on delivery" (`paymentMethod: counter`), which is what runs against the local test backend
- Lot tracing: `lots` in `src/data.js` holds one sample lot; footer newsletter box does nothing
- Gift box builder removed (cannot be priced by the server); Eat Now, plans, referrals and store credit are intentionally absent; no Google sign-in
- Products without an `imageUrl` show the jaali placeholder; descriptions come from the API
- No shipping fee: the quote has none. Prices are GST-exclusive; GST comes from the quote
- Coupon discount is not in the order payload; the confirmation page shows it only on the device that placed the order
