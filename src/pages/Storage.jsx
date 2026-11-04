import { Prose } from '../components/ui';
import usePageMeta from '../usePageMeta';

export default function Storage() {
  usePageMeta('Storage guide', 'How to store saffron, dry fruits and kahwa.');
  return (
    <Prose title="Storage guide" intro="Good dry fruit and saffron stay good if you keep them dry, cool and dark.">
      <h2>Saffron</h2>
      <p>Keep it in its sealed tin or an airtight jar, away from light, heat and damp.</p>
      <h2>Dry fruits and nuts</h2>
      <p>Store in an airtight container in a cool, dry cupboard. In humid weather, the fridge keeps nuts fresh for longer.</p>
      <h2>Kahwa</h2>
      <p>Close the pack tightly after each use and keep it away from strong smells.</p>
      <p>Check the pack for any best-before date and follow it.</p>
    </Prose>
  );
}
