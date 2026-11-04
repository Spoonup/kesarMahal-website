import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Chrome';
import { useStore } from './store';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Bag from './pages/Bag';
import NotFound from './pages/NotFound';
// Everything off the first-visit path loads on demand.
const Gifting = lazy(() => import('./pages/Gifting'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmed = lazy(() => import('./pages/Confirmed'));
const Account = lazy(() => import('./pages/Account'));
const Story = lazy(() => import('./pages/Story'));
const SignIn = lazy(() => import('./pages/SignIn'));
const GoogleCallback = lazy(() => import('./pages/GoogleCallback'));
const Contact = lazy(() => import('./pages/Contact'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Returns = lazy(() => import('./pages/Returns'));
const Faq = lazy(() => import('./pages/Faq'));
const Storage = lazy(() => import('./pages/Storage'));
const Track = lazy(() => import('./pages/Track'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

const Quiet = ({ children }) => <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>{children}</Suspense>;

function Shell() {
  const { pathname } = useLocation();
  const { toast } = useStore();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <a href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="fixed left-3 top-3 z-[60] -translate-y-[200%] bg-maroon px-4 py-3 text-sm text-ivory focus:translate-y-0">Skip to content</a>
      <Header /><main id="main" tabIndex={-1} className="outline-none"><Quiet><Outlet /></Quiet></main><Footer />
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">{toast && <div className="bg-pine px-6 py-3.5 text-sm text-ivory shadow-xl">{toast} ✓</div>}</div>
    </>
  );
}

export default function App() {
  return (
    <Quiet><Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="gifting" element={<Gifting />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="bag" element={<Bag />} />
        <Route path="account" element={<Account />} />
        <Route path="story" element={<Story />} />
        <Route path="contact" element={<Contact />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="returns" element={<Returns />} />
        <Route path="faq" element={<Faq />} />
        <Route path="storage" element={<Storage />} />
        <Route path="track" element={<Track />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="checkout" element={<Checkout />} />
      <Route path="confirmed/:id" element={<Confirmed />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="auth/google/callback" element={<GoogleCallback />} />
    </Routes></Quiet>
  );
}
