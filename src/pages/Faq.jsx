import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';
import usePageMeta from '../usePageMeta';

const faqs = [
  ['Where do you deliver?', 'Anywhere in India, for Pantry products.'],
  ['Is shipping free?', 'We do not charge a delivery fee right now. Prices on the site are before GST; GST is added at checkout and shown in your total.'],
  ['How can I pay?', 'Online through Razorpay when it is switched on for the shop. Otherwise you pay on delivery, and checkout will say so.'],
  ['Where is my order?', null],
  ['How should I store saffron and dry fruits?', null]
];

export default function Faq() {
  usePageMeta('Questions, answered', 'Short answers about delivery, payment, orders and storage.');
  return (
    <Prose title="Questions, answered" intro="The short answers. For anything else, we are a message away.">
      {faqs.map(([q, a]) => (
        <div key={q}>
          <h2>{q}</h2>
          {a ? <p>{a}</p> : q.startsWith('Where') ? <p>Orders placed on this device are listed under <Link to="/track">Track order</Link>; signed-in customers can also see them in Account. On another device, <Link to="/contact">contact us</Link> with your order number.</p> : <p>See the <Link to="/storage">storage guide</Link>.</p>}
        </div>
      ))}
      <p>Still stuck? <Link to="/contact">Contact us</Link>.</p>
    </Prose>
  );
}
