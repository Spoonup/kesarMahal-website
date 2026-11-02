import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Btn, H1, Arch } from '../components/ui';

const Field = ({ label, ...p }) => (
  <label className="flex flex-col border border-line bg-ivory px-4 py-3 focus-within:border-maroon"><span className="text-[11.5px] text-muted">{label}</span><input className="mt-0.5 w-full bg-transparent text-[17px] disabled:opacity-60" {...p} /></label>
);

export default function SignIn() {
  const { setUser } = useStore();
  const nav = useNavigate();
  const [mobile, setMobile] = useState('');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const submit = e => {
    e.preventDefault();
    if (!sent) { setSent(true); return; }
    // ponytail: OTP not verified; accepts any 4+ digits. Replace with the shared Spoonup auth API.
    if (otp.length < 4) return setErr('Enter the code we sent you.');
    setUser({ mobile: '+91 ' + mobile, name: '' });
    nav(-1);
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="jaali hidden items-center justify-center p-10 lg:flex"><Arch gold2 className="max-w-[380px] aspect-[380/520]"><img src="/assets/km-logo.jpg" alt="" className="size-full object-cover" /></Arch></div>
      <form onSubmit={submit} className="flex flex-col justify-center gap-[22px] px-6 py-12 sm:px-12 lg:px-24 lg:py-20">
        <Link to="/" className="font-cinzel text-2xl font-medium text-maroon">Kesar Mahal</Link>
        <H1 className="text-[clamp(36px,4.4vw,50px)] leading-[1.04]">Welcome back to the house.</H1>
        <p className="text-[15px] font-light leading-[1.6]">One account for Kesar Mahal and Spoonup. Your orders, addresses and credit carry across.</p>
        <Field label="Mobile number" required inputMode="tel" pattern="\d{10}" placeholder="98765 43210" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} disabled={sent} />
        {sent && <Field label="One-time code" autoFocus inputMode="numeric" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setErr(''); }} />}
        {err && <span className="text-[13px] text-kesar">{err}</span>}
        <Btn>{sent ? 'VERIFY & SIGN IN' : 'SEND OTP'}</Btn>
        <span className="text-[12.5px] text-muted">New here? Entering your number creates an account.</span>
      </form>
    </div>
  );
}
