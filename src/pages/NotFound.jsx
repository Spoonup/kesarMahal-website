import { Btn, Label, H1 } from '../components/ui';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-[22px] px-5 py-20 text-center">
      <div className="h-28 w-[140px] bg-[url('/assets/km-logo.jpg')] bg-[length:627%_auto] bg-[position:50.3%_8.2%] bg-no-repeat mix-blend-multiply" />
      <Label className="text-xs tracking-[.36em] text-gold">Error 404</Label>
      <H1 className="text-[clamp(40px,6vw,64px)]">This treasure has wandered off.</H1>
      <p className="max-w-[460px] text-base font-light leading-[1.6]">Perhaps it took a shikara across the lake. The rest of the house is just where you left it.</p>
      <div className="flex flex-wrap justify-center gap-3.5"><Btn to="/">BACK TO THE HOUSE</Btn><Btn to="/shop?room=Kesar" ghost>SHOP KESAR</Btn></div>
    </div>
  );
}
