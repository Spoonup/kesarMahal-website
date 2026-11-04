import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, friendly, getOrderToken, getOrderMeta } from '../api';
import { fmt, journey, statusInfo } from '../data';
import { Wordmark } from '../components/Chrome';
import { useStore } from '../store';
import { Btn, Eyebrow, H1, Diamond, ErrorBox, Lines, Line, PX, cx } from '../components/ui';
import usePageMeta from '../usePageMeta';

const day = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

// A guest can read their order only with the token saved when it was placed; a signed-in owner needs none.
export default function Confirmed() {
  usePageMeta('Your order');
  const { id } = useParams();
  const { user, authReady } = useStore();
  const [state, setState] = useState({ status: 'loading', order: null, error: '' });
  const load = useCallback(() => {
    setState(s => ({ ...s, status: 'loading' }));
    api.order(id).then(order => setState({ status: 'ready', order, error: '' })).catch(e => setState({ status: 'error', order: null, error: e.status === 404 ? 'We could not find that order on this device.' : friendly(e) }));
  }, [id]);
  useEffect(() => { if (authReady) load(); }, [authReady, load]);
  const { order, status, error } = state;
  const meta = getOrderMeta(id);
  const info = order ? statusInfo(order) : null;
  return (
    <>
      <div className={cx('flex justify-center border-b border-line bg-ivory py-5', PX)}><Wordmark size={24} /></div>
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-[22px] px-5 pb-20 pt-[72px] text-center">
        {status === 'loading' && <p aria-busy="true" className="text-muted">Fetching your order…</p>}
        {status === 'error' && <ErrorBox retry={load} className="w-full max-w-[520px] text-left">{error}{!getOrderToken(id) && !user ? ' Sign in to see orders linked to your account.' : ''}</ErrorBox>}
        {order && (
          <>
            <div className="flex flex-col items-center">
              <Diamond className="-mb-[3px] size-2.5" />
              <div className="flex h-[104px] w-[84px] items-center justify-center rounded-t-[42px] rounded-b-[3px] border-2 border-maroon pt-2.5 font-display text-4xl font-semibold text-maroon shadow-[inset_0_0_0_3px_#EFEAE2,inset_0_0_0_4px_#B08D57]">KM</div>
            </div>
            <Eyebrow>Order #{order.orderNumber} · {info.label}</Eyebrow>
            <H1 className="text-[clamp(36px,5vw,60px)] leading-[1.02]">{info.ended ? info.head : `Shukriya, ${String(order.customerName).split(' ')[0]}. ${info.head}`}</H1>
            <p className="max-w-[560px] text-base font-light leading-[1.6]">
              {order.expectedShipDate && !info.ended && info.step < 2 && <>Expected to ship by <b className="font-medium">{day(order.expectedShipDate)}</b>. </>}
              {info.payment && `${info.payment} `}We have your phone and email on file ({order.customerPhone}, {order.customerEmail}).
            </p>
            {info.step >= 0 && !info.ended && <div className="mt-5 grid w-full grid-cols-4">{journey.map((t, i) => (
              <div key={t} className="flex flex-col items-center gap-2.5"><span className={cx('size-[22px] rotate-45 border-[1.5px] border-maroon', i <= info.step ? 'bg-maroon' : 'bg-paper')} /><b className="font-display text-base font-medium text-maroon sm:text-[22px]">{t}</b></div>
            ))}</div>}
            <div className="w-full max-w-[520px] border border-line bg-ivory p-6 text-left text-[14.5px]">
              <Lines>
                {order.items.map(i => <Line key={i.id + i.name}><span className="font-light">{i.name} × {i.quantity}</span><span>{fmt(i.baseAmount ?? i.subtotal)}</span></Line>)}
                <Line><span className="font-light">Subtotal</span><span>{fmt(order.subtotalAmount)}</span></Line>
                <Line><span className="font-light">GST</span><span>{fmt(order.taxAmount)}</span></Line>
                {meta && <Line className="text-pine"><span>Coupon</span><span>− {fmt(meta.discount)}</span></Line>}
                <Line total><span>Total</span><span>{fmt(meta ? meta.payable : order.totalAmount)}</span></Line>
              </Lines>
              {order.deliveryAddress && <p className="mt-4 text-[13.5px] font-light text-muted">Delivering to {[order.deliveryAddress.line1, order.deliveryAddress.city, order.deliveryAddress.pincode].filter(Boolean).join(', ')}</p>}
            </div>
            <div className="flex flex-wrap justify-center gap-3.5">{info.ended && <Btn to="/contact">CONTACT US</Btn>}{user && <Btn to="/account" ghost={info.ended}>MY ORDERS</Btn>}<Btn to="/shop" ghost={Boolean(user) || info.ended}>KEEP BROWSING</Btn></div>
          </>
        )}
      </div>
    </>
  );
}
