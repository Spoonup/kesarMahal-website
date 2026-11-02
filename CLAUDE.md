# Kesar Mahal storefront

Never do the work yourself. Always hand it to a sub-agent.

Frontend for Kesar Mahal ("Treasures from Kashmir"), a Spoonup sub-brand selling Kashmiri saffron, dry fruits and kahwa. Built from the v2 mockup and brand guidelines in `~/Downloads/Kesar Mahal brand guidelines`.

## Stack

- React 18 + Vite 5 (JavaScript, JSX, no TypeScript)
- React Router 6 (`BrowserRouter`; routes in `src/App.jsx`)
- Tailwind CSS v4 via `@tailwindcss/vite`. Brand tokens (colours, fonts, `nav` breakpoint) live in the `@theme` block of `src/index.css`, which also holds the `jaali` pattern utilities. All styling is utility classes in JSX; no other CSS files and no UI library
- Google Fonts: Cinzel (labels), Cormorant Garamond (display), Jost (UI), JetBrains Mono (lot codes)
- State: React context in `src/store.jsx`, persisted to `localStorage` (`km_bag`, `km_user`, `km_orders`, `km_credit`)

## Commands

- `npm install`
- `npm run dev` (http://localhost:5173)
- `npm run build` / `npm run preview`

## Layout

- `src/catalogue.json`: 55 products (name, room, size → price) imported from kesarlandmart.com's public WooCommerce feed; `src/data.js` layers Kesar Mahal photos, grade badges and copy on top by site id
- `src/data.js`: catalogue, gift boxes, grades, lots, `fmt` (INR formatter), shipping constants
- `src/store.jsx`: cart, user, orders, `placeOrder`
- `src/components/`: `Chrome.jsx` (header/footer), `ui.jsx` (shared styled pieces: Btn, Label, Eyebrow, H1/H2, Photo, Badge, Arch, ProductCard, Qty, Field, Line)
- `src/pages/`: one file per route
- `public/assets/`: logo and product images

## Styling rules

- Use theme tokens (`bg-maroon`, `text-gold`, `border-line`, `font-display`, `font-cinzel`), not raw hex, except one-off arbitrary values.
- Repeated patterns become small components in `ui.jsx`, not `@apply` classes.
- Mobile first; layout switches at `lg` (1024px), header nav at the custom `nav` breakpoint (74rem).

## Brand rules

- Colours: Mahal Maroon `#6B1426`, Ivory `#F5F1EA`, Walnut Ink `#2A1E1A`, Zari Gold `#B08D57` (a thread, not a fill), accents Kesar `#C2431B`, Crocus `#8A5E9C`, Chinar Pine `#3D5240`. Category coding: Kesar = kesar, Dry fruits = gold, Kahwa = pine, Gifting = crocus.
- Cinzel is caps only, tracked wide; Cormorant for headlines and product names; Jost for body and buttons.
- Never lock the Kesar Mahal and Spoonup logos side by side; Spoonup appears only as "A Spoonup house".
- Don't stretch, recolour, rotate or crop the logo.

## Known stubs (replace when a backend exists)

- Payment: `src/pages/Checkout.jsx` only records the order locally
- Auth: `src/pages/SignIn.jsx` accepts any OTP of 4+ digits
- Lot tracing: `lots` in `src/data.js` holds one sample lot
- Catalogue is a one-time snapshot of kesarlandmart.com; prices may drift. Only the 12 products with a brand photo have an image, the rest show the jaali placeholder. Most products have no description. "Pack of 2" sizes come straight from the source
- Kesar, Kahwa and story images are missing (jaali placeholder shown)
- Free shipping threshold is ₹999 (`FREE_SHIP`); standard shipping is ₹99 below it, express ₹249
