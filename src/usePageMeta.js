import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from './site';

const DEFAULT_DESC = 'Kashmiri saffron, almonds, walnuts, honey and kahwa, shipped across India.';
const set = (sel, attr, val, make) => {
  let el = document.head.querySelector(sel);
  if (!el) { el = document.createElement(make.tag); Object.entries(make.attrs).forEach(([k, v]) => el.setAttribute(k, v)); document.head.appendChild(el); }
  el.setAttribute(attr, val);
};

// Per-route <title>, description, canonical and social tags. `title` null/'' = the site default.
// Crawlers that do not run JS still see the static tags in index.html.
export default function usePageMeta(title, description = DEFAULT_DESC, image) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title ? `${title} · Kesar Mahal` : 'Kesar Mahal · Treasures from Kashmir';
    const url = SITE_URL + (pathname === '/' ? '/' : pathname);
    const img = image || `${SITE_URL}/assets/km-logo.jpg`;
    document.title = full;
    const m = (key, val, prop = 'name') => set(`meta[${prop}="${key}"]`, 'content', val, { tag: 'meta', attrs: { [prop]: key } });
    m('description', description);
    m('og:title', full, 'property'); m('og:description', description, 'property'); m('og:url', url, 'property'); m('og:image', img, 'property');
    m('twitter:title', full); m('twitter:description', description); m('twitter:image', img);
    set('link[rel="canonical"]', 'href', url, { tag: 'link', attrs: { rel: 'canonical' } });
  }, [title, description, image, pathname]);
}
