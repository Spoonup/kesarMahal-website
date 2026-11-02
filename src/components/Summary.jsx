import { fmt } from '../data';
import { Lines, Line } from './ui';

// Totals exactly as the server quoted them. `coupon` is the server's advisory preview ({valid, discount}).
export function Totals({ quote }) {
  const { itemsSubtotal, taxTotal, calculatedTotal } = quote.totals;
  const off = quote.coupon?.valid ? quote.coupon.discount : 0;
  return (
    <Lines>
      <Line><span className="font-light">Subtotal</span><span>{fmt(itemsSubtotal)}</span></Line>
      <Line><span className="font-light">GST</span><span>{fmt(taxTotal)}</span></Line>
      {off > 0 && <Line className="text-pine"><span>Coupon {quote.coupon.code}</span><span>− {fmt(off)}</span></Line>}
      <Line><span className="font-light">Shipping</span><span className="text-pine">India-wide</span></Line>
      <Line total><span>Total</span><span>{fmt(payable(quote))}</span></Line>
    </Lines>
  );
}
export const payable = quote => Math.max(0, Math.round((quote.totals.calculatedTotal - (quote.coupon?.valid ? quote.coupon.discount : 0)) * 100) / 100);
