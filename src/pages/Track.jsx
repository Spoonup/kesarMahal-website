import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Btn, Field, Prose } from '../components/ui';

export default function Track() {
  const nav = useNavigate();
  const [id, setId] = useState('');
  return (
    <Prose title="Track order" intro="Enter your order number to see its status.">
      <form className="flex flex-col gap-3" onSubmit={e => { e.preventDefault(); nav('/confirmed/' + encodeURIComponent(id.trim())); }}>
        <Field label="Order number" required value={id} onChange={e => setId(e.target.value)} />
        <Btn type="submit" className="self-start">FIND MY ORDER</Btn>
      </form>
      <p className="text-[13px] text-muted">For now, guest orders can only be opened on the device and browser that placed them; signed-in customers can also see them in Account. On another device, please <Link to="/contact">contact us</Link> with your order number.</p>
    </Prose>
  );
}
