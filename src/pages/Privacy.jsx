import { Link } from 'react-router-dom';
import { Prose } from '../components/ui';
import { CONTACT } from '../contact';

export default function Privacy() {
  return (
    <Prose eyebrow="Legal" title="Privacy policy" intro="Draft for the owner to review before launch. [to confirm with legal advice]">
      <h2>What we collect</h2>
      <p>The details you give us to place an order or write to us: name, phone, email and delivery address. We also keep your bag and sign-in on your device so the shop works.</p>
      <h2>How we use it</h2>
      <p>To pack, deliver and support your order. Card and UPI payments are handled by Razorpay; we do not see your card details.</p>
      <h2>Sharing</h2>
      <p>We share what is needed with our delivery and payment partners. We do not sell your details.</p>
      <h2>Your choices</h2>
      <p>Ask us to correct or delete your details at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or through <Link to="/contact">Contact</Link>.</p>
    </Prose>
  );
}
