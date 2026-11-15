import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { api, friendly } from '../api';
import { ErrorBox } from '../components/ui';
import usePageMeta from '../usePageMeta';
import { safeNext } from '../safeNext';

// Where the backend sends the browser after Google: swap the one-time code for a session.
export default function GoogleCallback() {
  usePageMeta('Signing in');
  const { signIn } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const code = params.get('code');
  const next = params.get('next');
  const ran = useRef(false); // the code is single-use; StrictMode runs effects twice in dev
  const [err, setErr] = useState(code ? '' : 'Google sign-in did not finish. Please try again.');
  useEffect(() => {
    if (!code || ran.current) return;
    ran.current = true;
    api.googleExchange(code)
      .then(r => {
        // newAccount and referral ride along. This site has no referral programme and never sends `ref`, so a referral result is not shown. The account is signed in either way.
        signIn({ token: r.token, user: r.user });
        nav(safeNext(next) || '/account', { replace: true });
      })
      .catch(e => setErr(friendly(e)));
  }, [code, next, signIn, nav]);
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      {err ? <div className="flex flex-col items-center gap-4"><ErrorBox>{err}</ErrorBox><Link to="/signin" className="border-b border-maroon text-maroon">Back to sign in</Link></div> : <p className="font-display text-2xl">Signing you in…</p>}
    </div>
  );
}
