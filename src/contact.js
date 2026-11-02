// Owner: fill the bracketed placeholders once; every help page reads from here.
// The email was found in the SpoonUp storefront code; phone, address and hours were not found anywhere.
export const TBC = '[to confirm]';
export const CONTACT = {
  email: 'support@spoonupfoods.com',
  phone: '[phone number to confirm]',
  address: '[registered address to confirm]',
  hours: '[support hours to confirm]'
};
export const mailto = (subject, body) => `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
