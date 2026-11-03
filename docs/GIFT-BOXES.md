# Gift boxes: admin setup

The /gifting builder charges the box fee through the normal server quote, so each box must exist as a catalogue product. In the SpoonUp admin create three **Pantry** (`DELIVERY_IN_DAYS`) products, available, with exactly these names (the storefront matches by exact name):

| Name | Reference price (ex-GST) | Sizes |
|---|---|---|
| `Gift Box - Shikara` | ₹250 | one size (or none), single price |
| `Gift Box - Chinar` | ₹350 | one size (or none), single price |
| `Gift Box - Mahal` | ₹500 | one size (or none), single price |

Set GST as for other pantry goods. Add a plain image if you like. Until a box product exists the storefront shows that tier as "Unavailable" and the box cannot be added to the bag. Prices live only in the admin; the reference prices above are what the owner's design shows.

Tier, colour and gift note are not part of the cart quote. They travel in the order `notes` field as `Gift box: Chinar, Maroon. Note: <text>` (max 250 chars). Backend request: make sure `POST /api/checkout/prepare` accepts and stores `notes` and shows it on the order for packing.
