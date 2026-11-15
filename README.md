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
4. Payment: if the backend reports `razorpayEnabled` in `/api/settings`, checkout opens Razorpay (the connected backend currently has test keys). Otherwise it places a "pay on delivery" order. See `docs/BACKEND-REQUESTS.md`.

## Seeding a local backend

`scripts/seed-local-from-live.mjs` copies the live Pantry products into a LOCAL backend (refuses any target except localhost; credentials from env vars only):

    ADMIN_USERNAME=<local test admin> ADMIN_PASSWORD=<local test admin password> node scripts/seed-local-from-live.mjs

## Production API

`npm run build` reads the committed `.env.production`, which holds one non-secret value: `VITE_API_BASE=https://spoonupfoods.com`. Every production build (local or CI) talks to the live backend. `npm run dev` does not read that file and keeps using the Vite proxy. The backend must allow `https://kesarmahal.com` and `https://www.kesarmahal.com` in `CORS_ORIGINS` (requests send the custom `x-storefront` header, so the browser preflights them).

Stubs: the footer newsletter box is not wired to anything and lot tracing is hidden (demo data only). Launch audit: `docs/GAPS.md`. `npm run check:launch` fails while any `[to confirm]` placeholder remains in `src/` (legal and contact copy the owner is still supplying).

## Deploy (Firebase Hosting)

Hosting is the GCP/Firebase project `spoonup-508319`, on a dedicated site (target `kesarmahal` mapped to site id `kesarmahal` in `.firebaserc`), so the project's default site is never touched. `firebase.json` serves `dist/`, rewrites every path to `/index.html` (the app uses `BrowserRouter`) and sets the cache and security headers.

- `.github/workflows/firebase-hosting-merge.yml` runs on every push to `main`: `npm ci`, `npm run check:launch`, `npm run build`, then a live-channel deploy. Live deploys never overlap. **`check:launch` is meant to fail, and to block the live deploy, until the `[to confirm]` placeholders in `src/` are filled in.**
- `.github/workflows/firebase-hosting-pull-request.yml` builds every pull request. Pull requests from this repo (not forks, which get no secrets) also get a 7-day preview channel. Preview URLs are `*.web.app` origins, so API calls from them fail until the backend's CORS allows that origin.

Required GitHub secret: `FIREBASE_SERVICE_ACCOUNT_SPOONUP_508319` (the JSON key of a deploy service account).

One-time setup:

    # 1. Deploy service account.
    #    Firebase Hosting Admin deploys. API Keys Viewer is required by the Firebase CLI deploys this action runs.
    #    roles/iam.serviceAccountUser is not needed. Cloud Run Viewer is not needed: there are no Cloud Run or Functions rewrites.
    gcloud iam service-accounts create github-kesarmahal-deploy --project spoonup-508319 --display-name "GitHub Actions: Kesar Mahal Hosting deploy"
    SA=github-kesarmahal-deploy@spoonup-508319.iam.gserviceaccount.com
    gcloud projects add-iam-policy-binding spoonup-508319 --member "serviceAccount:$SA" --role roles/firebasehosting.admin --condition=None
    gcloud projects add-iam-policy-binding spoonup-508319 --member "serviceAccount:$SA" --role roles/serviceusage.apiKeysViewer --condition=None
    # Optional, only if the project uses Firebase Authentication: lets the action add preview URLs to Auth authorized domains.
    # gcloud projects add-iam-policy-binding spoonup-508319 --member "serviceAccount:$SA" --role roles/firebaseauth.admin --condition=None

    # 2. Key into the GitHub secret, then delete the local copy.
    gcloud iam service-accounts keys create key.json --iam-account "$SA" --project spoonup-508319
    gh secret set FIREBASE_SERVICE_ACCOUNT_SPOONUP_508319 --repo Spoonup/kesarMahal-website < key.json
    rm -P key.json   # macOS; use `shred -u key.json` on Linux

    # 3. Hosting site and target. Site ids are global; if `kesarmahal` is taken, use `kesarmahal-web`
    #    and put that id in .firebaserc under targets.spoonup-508319.hosting.kesarmahal.
    firebase login
    firebase hosting:sites:create kesarmahal --project spoonup-508319
    firebase target:apply hosting kesarmahal kesarmahal --project spoonup-508319

Custom domain: Firebase console, Hosting, site `kesarmahal`, Add custom domain, `kesarmahal.com`, then again for `www.kesarmahal.com` (redirect to the apex). At the registrar, add the records the console shows: a TXT record on the apex to prove ownership, then the A records it lists (and usually a CNAME for `www`). Remove any other A or AAAA records on the apex. The certificate is issued automatically once DNS resolves, which can take up to 24 hours.

Manual deploy (after `firebase login`): `npm run build && firebase deploy --only hosting:kesarmahal --project spoonup-508319`.

`vercel.json`, `public/_headers` and `public/_redirects` are obsolete. Firebase Hosting does not read them. They are kept for reference; their CSP is older than the one in `firebase.json`.

## Site URL

The site URL is `https://kesarmahal.com`, set in `src/site.js`, `index.html` (canonical, `og:url`, `og:image`, `twitter:image`), `public/robots.txt` and `public/sitemap.xml`. Keep the four in sync.

## Google sign-in

Uses the SpoonUp backend's server-side flow (`GET /api/auth/google` -> Google -> backend callback -> `/auth/google/callback?code=` -> `POST /api/auth/google/exchange`). The client ID/secret live only in the backend (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`); the storefront needs no Google env var. It works only when `/api/settings` reports `googleAuthEnabled` and the site and `/api` share an origin (dev proxy or production reverse proxy). See `docs/BACKEND-REQUESTS.md` #10.

## Security headers and CSP

`firebase.json` is what gets deployed: a CSP plus nosniff, DENY framing (`frame-ancestors 'none'` and `X-Frame-Options`), `Referrer-Policy: strict-origin-when-cross-origin`, HSTS and a permissions policy. The app has no inline scripts. It loads Razorpay's script and frame, Google Fonts, and product images from `https://storage.googleapis.com`. `connect-src` allows `https://spoonupfoods.com` plus Razorpay (`api`, `lumberjack`, `checkout`). If `VITE_API_BASE` changes, update that `connect-src` to match. `vercel.json` and `public/_headers` are the older copies and are not deployed.
