import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';

export default function Terms() {
  return (
    <Prose eyebrow="Legal" title="Terms of sale" intro="Draft for the owner to review before launch. [to confirm with legal advice]">
      <h2>Orders and prices</h2>
      <p>Prices are in rupees and exclude GST; GST is added at checkout and shown in your total. The total confirmed at checkout is what you pay.</p>
      <h2>Payment</h2>
      <p>Online through Razorpay when available, otherwise pay on delivery.</p>
      <h2>Delivery</h2>
      <p>We ship Pantry products across India. See <Link to="/shipping">Shipping & delivery</Link>. Coming-soon items cannot be ordered.</p>
      <h2>Returns</h2>
      <p>See <Link to="/returns">Returns & refunds</Link>.</p>
      <h2>Who we are</h2>
      <p>Kesar Mahal is a Spoonup house. Legal entity name and address: [to confirm].</p>
    </Prose>
  );
}
