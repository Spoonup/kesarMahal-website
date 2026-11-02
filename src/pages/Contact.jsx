import { useState } from 'react';
import { Btn, Field, Prose } from '../components/ui';
import { CONTACT, mailto } from '../contact';

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', order: '', message: '' });
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const body = `${f.message}\n\nName: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone || '-'}\nOrder number: ${f.order || '-'}`;
  const href = mailto(`Kesar Mahal enquiry${f.order ? ` (order ${f.order})` : ''}`, body);
  return (
    <Prose eyebrow="House" title="Contact us" intro="Questions about an order, a product or a gift? Write to us and a person will reply.">
      <div className="flex flex-col gap-1">
        <span>Email: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></span>
        <span>Phone: {CONTACT.phone}</span>
        <span>Address: {CONTACT.address}</span>
        <span>Hours: {CONTACT.hours}</span>
      </div>
      <form className="mt-2 flex flex-col gap-3" onSubmit={e => { e.preventDefault(); window.location.href = href; }}>
        <Field label="Name" required value={f.name} onChange={set('name')} autoComplete="name" />
        <Field label="Email" type="email" required value={f.email} onChange={set('email')} autoComplete="email" />
        <Field label="Phone (optional)" type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" />
        <Field label="Order number (optional)" value={f.order} onChange={set('order')} />
        <Field label="Message" area rows={5} required value={f.message} onChange={set('message')} />
        <Btn type="submit" className="self-start">OPEN EMAIL TO SEND</Btn>
        <p className="text-[13px] text-muted">This opens your email app with the message ready to send to {CONTACT.email}. Nothing is sent from this page itself.</p>
      </form>
    </Prose>
  );
}
