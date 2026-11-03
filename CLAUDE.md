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

- `src/api.js`: the only module that calls the SpoonUp backend (base from `VITE_API_BASE`, headers `x-storefront: kesarmahal` (sent on every call) / `x-user-token` / `x-order-token`, error code to message map, guest order tokens in `localStorage`)
- `scripts/seed-local-from-live.mjs`: test-only; copies live Pantry products into the LOCAL backend (localhost only, creds from env)
- `src/data.js`: `fmt`, shelves: `SHELVES` (order: Dry Fruits & Berries, Kesar, Honey, Kahwa, Pantry, Wellness) and one explicit map `SHELF_OF` backend category/room -> shelf (Dry Fruits, Kashmiri Dry Fruits, Dried Berries -> Dry Fruits & Berries; Saffron/Kesar -> Kesar; Spices, Seeds, Oils, Food, Healthy Breakfast -> Pantry; Beauty, Health -> Wellness). `shelfOf` sends every unmapped category (new or test, e.g. "testing") to the catch-all `Pantry`, so a new admin category never adds a filter. `resolveShelf` keeps old `/shop?category=<category>` deep links working (unknown -> All). `p.room` = shelf, `p.category` = backend string (shown on cards); backend strings untouched. `GIFTING` allowlist (exact live product names for `/gifting`; skipped if missing, sold out or unpriced), `adapt` (API product to UI product), kesar `grades`, sample `lots`
- `src/store.jsx`: live catalogue (Pantry only: `fulfillmentKind === 'DELIVERY_IN_DAYS'`), bag (`{productId, sizeId, qty}` only, no prices), session user, `useQuote` (prices the bag via `POST /api/cart/quote`)
- Gift builder: `pages/Gifting.jsx` (`/gifting`). `BOXES`, `BOX_COLOURS`, `NOTE_MAX`, `boxProductOf`, `treasuresOf`, `giftNotes`, `bagKey` in `data.js`. The box fee is a real catalogue product per tier ("Gift Box - Shikara/Chinar/Mahal", created by the owner in the SpoonUp admin, see `docs/GIFT-BOXES.md`); a missing one shows that tier as "Coming soon" and blocks add-to-bag (no client-side fee). The panel prices would-be lines with `useQuote(…, override)`. In the bag, gift lines carry `gift: <id>` (details in `km_gifts`, no prices), show as one block in `/bag`, are removed as a group, and checkout sends `notes` ("Gift box: Chinar, Maroon. Note: …", max 250 chars). Quote lines are matched to bag lines by position
- `src/components/`: `Chrome.jsx` (header/footer; header: left nav Shop all / Dry Fruits / Dried Berries / Honey / Gifting, no Search link (search lives on /shop), right Our Story text link + Sign in (Account when signed in) ivory pill + Bag maroon pill with count chip, gold hairline, gold thread hover), `ui.jsx` (shared styled pieces; `ProductCard` shows the API `description` (2-line italic), size chips (priced sizes only), price per chosen size and "Add to bag" straight from the card, image/name/"View details" link to the product page: Btn, Label, Eyebrow, H1/H2, Photo, Badge, Arch, ProductCard, Skeleton, ErrorBox, Qty, Field, Line, ShelfTabs = shop category filter), `Summary.jsx` (server-quoted totals), `ErrorBoundary.jsx` (branded fallback with Reload, wraps `<App/>` in `main.jsx`)
- `src/pages/`: one file per route (Shop, Gifting, Product, Bag, Checkout, Confirmed, SignIn, Account, Home, Story, plus help pages Contact, Shipping, Returns, Faq, Storage, Track, Privacy, Terms). Text pages use `Prose` from `ui.jsx`; draft copy has `[to confirm]` tokens for the owner
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


- Payment: online (Razorpay) only when `/api/settings` has `razorpayEnabled`; otherwise "pay on delivery" (`paymentMethod: counter`), which is what runs against the local test backend
- Lot tracing: `lots` in `src/data.js` holds one sample lot; footer newsletter box does nothing
- Eat Now, plans, referrals and store credit are intentionally absent; Google sign-in uses the backend's redirect flow (no client ID or env var in the frontend): button on `/signin` shown always, works only when `/api/settings` has `googleAuthEnabled`; `pages/GoogleCallback.jsx` redeems the code (see BACKEND-REQUESTS #10)
- Products without an `imageUrl` show the jaali placeholder; descriptions come from the API
- No shipping fee: the quote has none. Prices are GST-exclusive; GST comes from the quote
- Coupon discount is not in the order payload; the confirmation page shows it only on the device that placed the order
