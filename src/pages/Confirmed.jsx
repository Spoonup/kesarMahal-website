import { useLocation, useParams } from 'react-router-dom';
import { Wordmark } from '../components/Chrome';
import { Btn, Eyebrow, H1, Diamond, PX, cx } from '../components/ui';

export const journey = ['Graded', 'Sealed', 'Shipped', 'At your door'];
export const eta = d => { const x = new Date(d); x.setDate(x.getDate() + 5); return x.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };

export default function Confirmed() {
  const { id } = useParams();
  const { state } = useLocation();
  return (
    <>
      <div className={cx('flex justify-center border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} /></div>
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-[22px] px-5 pb-20 pt-[72px] text-center">
        <div className="flex flex-col items-center">
          <Diamond className="-mb-[3px] size-2.5" />
          <div className="flex h-[104px] w-[84px] items-center justify-center rounded-t-[42px] rounded-b-[3px] border-2 border-maroon pt-2.5 font-display text-4xl font-semibold text-maroon shadow-[inset_0_0_0_3px_#EFEAE2,inset_0_0_0_4px_#B08D57]">KM</div>
        </div>
        <Eyebrow>Order {id} · confirmed</Eyebrow>
        <H1 className="text-[clamp(36px,5vw,60px)] leading-[1.02]">Shukriya{state?.name ? `, ${state.name}` : ''}. Your treasures are being packed in Srinagar.</H1>
        <p className="max-w-[560px] text-base font-light leading-[1.6]">We’ll message you at every step. Expected at your door by <b className="font-medium">{eta(new Date())}</b>.</p>
        <div className="mt-5 grid w-full grid-cols-4">{journey.map((t, i) => (
          <div key={t} className="flex flex-col items-center gap-2.5"><span className={cx('size-[22px] rotate-45 border-[1.5px] border-maroon', i === 0 ? 'bg-maroon' : 'bg-paper')} /><b className="font-display text-base font-medium text-maroon sm:text-[22px]">{t}</b></div>))}
        </div>
        <div className="flex flex-wrap justify-center gap-3.5"><Btn to="/account">TRACK ORDER</Btn><Btn to="/shop" ghost>KEEP BROWSING</Btn></div>
      </div>
    </>
  );
}
