import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { api, friendly } from '../api';
import { Btn, H1, Arch, ErrorBox } from '../components/ui';

const Field = ({ label, ...p }) => (
  <label className="flex flex-col border border-line bg-ivory px-4 py-3 focus-within:border-maroon"><span className="text-[11.5px] text-muted">{label}</span><input className="mt-0.5 w-full bg-transparent text-[17px]" {...p} /></label>
);

export default function SignIn() {
  const { signIn } = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ username: '', password: '', email: '', phone: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const signup = mode === 'signup';
  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr('');
    try {
      const r = signup
        ? await api.signup({ username: f.username.trim(), password: f.password, email: f.email.trim(), phone: f.phone })
        : await api.login({ username: f.username.trim(), password: f.password });
      signIn(r);
      nav(next && next.startsWith('/') && !next.startsWith('//') ? next : '/account', { replace: true });
    } catch (ex) { setErr(friendly(ex)); setBusy(false); }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="jaali hidden items-center justify-center p-10 lg:flex"><Arch gold2 className="max-w-[380px] aspect-[380/520]"><img src="/assets/km-logo.jpg" alt="" className="size-full object-cover" /></Arch></div>
      <form onSubmit={submit} className="flex flex-col justify-center gap-[22px] px-6 py-12 sm:px-12 lg:px-24 lg:py-20">
        <Link to="/" className="font-cinzel text-2xl font-medium text-maroon">Kesar Mahal</Link>
        <H1 className="text-[clamp(36px,4.4vw,50px)] leading-[1.04]">{signup ? 'Join the house.' : 'Welcome back to the house.'}</H1>
        <p className="text-[15px] font-light leading-[1.6]">Your orders and saved addresses, in one place. You can also check out as a guest.</p>
        <Field label={signup ? 'Username (3-32 letters, numbers, underscores)' : 'Username or email'} required autoComplete="username" value={f.username} onChange={set('username')} />
        {signup && <Field label="Email" type="email" required autoComplete="email" value={f.email} onChange={set('email')} />}
        {signup && <Field label="Mobile (10 digits)" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} autoComplete="tel-national" value={f.phone} onChange={e => setF(s => ({ ...s, phone: e.target.value.replace(/\D/g, '') }))} />}
        <Field label={signup ? 'Password (8 or more characters)' : 'Password'} type="password" required minLength={signup ? 8 : undefined} autoComplete={signup ? 'new-password' : 'current-password'} value={f.password} onChange={set('password')} />
        {err && <ErrorBox>{err}</ErrorBox>}
        <Btn disabled={busy}>{busy ? 'PLEASE WAIT…' : signup ? 'CREATE ACCOUNT' : 'SIGN IN'}</Btn>
        <button type="button" className="self-start border-b border-maroon text-[13.5px] text-maroon" onClick={() => { setMode(signup ? 'login' : 'signup'); setErr(''); }}>{signup ? 'I already have an account' : 'New here? Create an account'}</button>
      </form>
    </div>
  );
}
