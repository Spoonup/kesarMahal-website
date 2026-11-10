# Kesar Mahal storefront

React + Vite + React Router + Tailwind v4. Catalogue, prices, orders and accounts all come from the existing SpoonUp backend (Pantry products only). Only the bag, the guest order tokens and the session token live in `localStorage`.

    npm install
    npm run dev      # http://localhost:5173
    npm run build

## Running with the SpoonUp backend

1. Start the SpoonUp backend (Express, port 5101). Check which database it uses: it may be a cloud database holding REAL data, so while developing never sign up, check out or pay.
2. `npm run dev`. Vite proxies `/api/*` to `http://localhost:5101`, so the browser makes same-origin calls and there are no CORS issues. Use `DEV_API_TARGET=http://host:port npm run dev` if the backend runs elsewhere.
3. Env vars (see `.env.example`; never commit real `.env` files, and nothing secret belongs in this repo):
   - `VITE_API_BASE`: backend origin for production builds, e.g. `https://api.example.com`. Leave empty when the site and `/api` share a domain (reverse proxy). It is baked in at build time: `VITE_API_BASE=https://api.example.com npm run build`. A cross-origin API must allow this site in its CORS config.
4. Payment is online only (Razorpay). Checkout opens it when `/api/settings` reports `razorpayEnabled` and a key. If settings fail to load, or online payment is switched off, checkout says online payment is temporarily unavailable and does not place the order. There is no pay-on-delivery option. The connected backend currently has test keys. See `docs/BACKEND-REQUESTS.md`.

## Seeding a local backend

`scripts/seed-local-from-live.mjs` copies the live Pantry products into a LOCAL backend (refuses any target except localhost; credentials from env vars only):

    ADMIN_USERNAME=<local test admin> ADMIN_PASSWORD=<local test admin password> node scripts/seed-local-from-live.mjs

## Switching to production later

The storefront never points at production by default. Only the owner switches it on, by building with the env var: `VITE_API_BASE=https://spoonupfoods.com npm run build` (check CORS first, see `docs/BACKEND-REQUESTS.md`). The same build then shows the real catalogue.

Stubs: the footer newsletter box is not wired to anything. Launch audit: `docs/GAPS.md`.

## Deploying

The app uses `BrowserRouter`, so the host must serve `index.html` for every path: `vercel.json` (Vercel) and `public/_redirects` (Netlify/Cloudflare Pages) both do this; use the one for your host. Set `VITE_API_BASE` at build time or add an `/api` rewrite on the host. A cross-origin backend needs CORS for this site.

## Site URL (owner must set)

`https://kesarmahal.example` is a placeholder (reserved TLD, not a real domain). Replace it with the real site URL in `src/site.js`, `index.html` (canonical, `og:url`, `og:image`, `twitter:image`), `public/robots.txt` and `public/sitemap.xml`. Find every spot with `grep -rn kesarmahal.example index.html public src`. Check pages for leftover placeholders with `npm run check:launch`.

## API routing on Vercel (example, not enabled)

`vercel.json` only rewrites to `index.html`. Without a same-origin `/api` or `VITE_API_BASE`, every page shows "Could not load the pantry". To proxy `/api` to the backend, put this rewrite BEFORE the catch-all (replace the host with the owner's real backend URL):

    {"rewrites":[
      {"source":"/api/(.*)","destination":"https://YOUR-BACKEND-HOST/api/$1"},
      {"source":"/(.*)","destination":"/index.html"}
    ]}

## Google sign-in

Uses the SpoonUp backend's server-side flow (`GET /api/auth/google` -> Google -> backend callback -> `/auth/google/callback?code=` -> `POST /api/auth/google/exchange`). The client ID/secret live only in the backend (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`); the storefront needs no Google env var. It works only when `/api/settings` reports `googleAuthEnabled` and the site and `/api` share an origin (dev proxy or production reverse proxy). See `docs/BACKEND-REQUESTS.md` #10.

## Security headers and CSP

`vercel.json` (Vercel) and `public/_headers` (Netlify) send a CSP plus nosniff, DENY framing, referrer policy, HSTS and a permissions policy. The app has no inline scripts; it loads Razorpay's script and frame, Google Fonts CSS/fonts and product images over https. `connect-src` is `'self'` plus Razorpay: if `/api` is NOT same-origin (a `VITE_API_BASE` pointing at another host), add that backend origin to `connect-src` in both files or every API call is blocked. Keep the two files in sync.
