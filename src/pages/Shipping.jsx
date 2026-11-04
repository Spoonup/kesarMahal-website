import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';
import { TBC } from '../contact';
import usePageMeta from '../usePageMeta';

export default function Shipping() {
  usePageMeta('Shipping & delivery', 'Where Kesar Mahal delivers, delivery charges and how to follow an order.');
  return (
    <Prose title="Shipping & delivery" intro="Everything in the Pantry ships across India.">
      <h2>Where we deliver</h2>
      <p>Pantry products (saffron, dry fruits, kahwa) are delivered anywhere in India.</p>
      <h2>Delivery charge</h2>
      <p>We do not charge for shipping at the moment. The total on your bag page is exactly what you pay, plus GST at checkout.</p>
      <h2>How long it takes</h2>
      <p>Orders are packed in {TBC} working days and usually arrive within {TBC} days after dispatch. Remote pin codes may take longer.</p>
      <h2>Tracking</h2>
      <p>You can open any order placed on this device from <Link to="/track">Track order</Link>. Questions about a parcel? <Link to="/contact">Contact us</Link> with your order number.</p>
    </Prose>
  );
}
