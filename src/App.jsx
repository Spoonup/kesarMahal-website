import { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Chrome';
import { useStore } from './store';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Gifting from './pages/Gifting';
import Bag from './pages/Bag';
import Checkout from './pages/Checkout';
import Confirmed from './pages/Confirmed';
import Account from './pages/Account';
import Story from './pages/Story';
import SignIn from './pages/SignIn';
import GoogleCallback from './pages/GoogleCallback';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Faq from './pages/Faq';
import Storage from './pages/Storage';
import Track from './pages/Track';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

function Shell() {
  const { pathname } = useLocation();
  const { toast } = useStore();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <Header /><main><Outlet /></main><Footer />
      {toast && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-pine px-6 py-3.5 text-sm text-ivory shadow-xl">{toast} ✓</div>}
    </>
  );
}

export default function App() {
  return (
    <Routes>
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
    </Routes>
  );
}
