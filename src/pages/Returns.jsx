import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';
import { TBC } from '../contact';

export default function Returns() {
  return (
    <Prose title="Returns & refunds" intro="If something is not right with your order, tell us and we will make it right.">
      <h2>Damaged, wrong or unsatisfactory items</h2>
      <p>Write to us within {TBC} days of delivery with your order number and a photo. We will replace the item or refund you, whichever you prefer.</p>
      <h2>Food products</h2>
      <p>Because these are food items, we cannot take back opened packs unless there is a quality problem. [to confirm with the owner]</p>
      <h2>How refunds are paid</h2>
      <p>Orders paid online are refunded to the original payment method in {TBC} working days. For pay on delivery orders we will agree a refund method with you.</p>
      <p><Link to="/contact">Contact us</Link> to start a return.</p>
    </Prose>
  );
}
