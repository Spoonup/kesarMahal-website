import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';

const faqs = [
  ['Where do you deliver?', 'Anywhere in India, for Pantry products.'],
  ['Is shipping free?', 'We do not charge a delivery fee right now. Prices on the site are before GST; GST is added at checkout and shown in your total.'],
  ['How can I pay?', 'Online through Razorpay when it is switched on for the shop. Otherwise you pay on delivery, and checkout will say so.'],
  ['Why can I not order some items?', 'Those marked coming soon are not on sale yet. They have no price and cannot be added to the bag.'],
  ['Where is my order?', null],
  ['How should I store saffron and dry fruits?', null]
];

export default function Faq() {
  return (
    <Prose title="Questions, answered" intro="The short answers. For anything else, we are a message away.">
      {faqs.map(([q, a]) => (
        <div key={q}>
          <h2>{q}</h2>
          {a ? <p>{a}</p> : q.startsWith('Where') ? <p>Open <Link to="/track">Track order</Link> with your order number.</p> : <p>See the <Link to="/storage">storage guide</Link>.</p>}
        </div>
      ))}
      <p>Still stuck? <Link to="/contact">Contact us</Link>.</p>
    </Prose>
  );
}
