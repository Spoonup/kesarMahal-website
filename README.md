# Kesar Mahal storefront

React + Vite + React Router + Tailwind v4. Catalogue, prices, orders and accounts all come from the existing SpoonUp backend (Pantry products only). Only the bag, the guest order tokens and the session token live in `localStorage`.

    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Running with the SpoonUp backend

1. Start the SpoonUp backend (Express, port 5101 in local test mode with a throwaway database). Never point this project at production data while developing.
2. `npm run dev`. Vite proxies `/api/*` to `http://localhost:5101`, so the browser makes same-origin calls and there are no CORS issues. Use `DEV_API_TARGET=http://host:port npm run dev` if the backend runs elsewhere.
3. Env vars (see `.env.example`; never commit real `.env` files, and nothing secret belongs in this repo):
   - `VITE_API_BASE`: backend origin for production builds, e.g. `https://api.example.com`. Leave empty when the site and `/api` share a domain (reverse proxy). It is baked in at build time: `VITE_API_BASE=https://api.example.com npm run build`. A cross-origin API must allow this site in its CORS config.
4. Payment: if the backend reports `razorpayEnabled` in `/api/settings`, checkout opens Razorpay. Otherwise (local test mode) it places a "pay on delivery" order, because the fake gateway can only be completed by a signed server webhook. See `docs/BACKEND-REQUESTS.md`.

## Live catalogue in local dev

The local throwaway backend is seeded with copies of the Pantry products that are live on spoonupfoods.com (SpoonUp's own business):

    ADMIN_USERNAME=<local test admin> ADMIN_PASSWORD=<local test admin password> node scripts/seed-local-from-live.mjs

The script does one read-only, unauthenticated GET of the public catalogue, then writes only to `http://localhost:5101` (it refuses any other target; credentials come from env vars only, nothing is stored in the repo). It replaces the local Pantry products (keeping `Test Sold Out Honey`, the sold-out test fixture). Product images are the owner's own assets, shown from their absolute URLs (read-only static files); the storefront makes no other call to production. `docs/LIVE-MATCH.md` lists which supplier products are live; the rest stay "Coming soon".

## Switching to production later

The storefront never points at production by default. Only the owner switches it on, by building with the env var: `VITE_API_BASE=https://spoonupfoods.com npm run build` (check CORS first, see `docs/BACKEND-REQUESTS.md`). The same build then shows the real catalogue.

Stubs: lot tracing and the footer newsletter box are not wired to anything.

## Deploying

The app uses `BrowserRouter`, so the host must serve `index.html` for every path: `vercel.json` (Vercel) and `public/_redirects` (Netlify/Cloudflare Pages) both do this; use the one for your host. Set `VITE_API_BASE` at build time or add an `/api` rewrite on the host. A cross-origin backend needs CORS for this site.

## Google sign-in

Uses the SpoonUp backend's server-side flow (`GET /api/auth/google` -> Google -> backend callback -> `/auth/google/callback?code=` -> `POST /api/auth/google/exchange`). The client ID/secret live only in the backend (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`); the storefront needs no Google env var. It works only when `/api/settings` reports `googleAuthEnabled` and the site and `/api` share an origin (dev proxy or production reverse proxy). See `docs/BACKEND-REQUESTS.md` #10.
