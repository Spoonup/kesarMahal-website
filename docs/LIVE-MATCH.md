# Supplier catalogue vs spoonupfoods.com (Pantry)

Checked 2026-11-02 with read-only GETs of the public `/api/products` (DELIVERY_IN_DAYS only: 31 products). Prices are excl. GST (5%), as served. Matches are by name/variety and conservative. Mapping used by the app: `src/liveTwin.json`.

**28 of 55** supplier products are live; **27** are not. **3** live Pantry products are not in the supplier list.

Judgement calls: "Mix DryFruits" -> "Mixed Dry Fruits" (same name, probable); "Meethi Saunf" -> "Sauf" (fennel, probable); "Almond (Kashmiri Mamra)" -> "Kashmiri Mamra Almonds", not "Kashmiri Almonds (100% Pure)".

## Supplier -> live

| Supplier (id) | Live product | Category | Sizes (excl. GST) |
|---|---|---|---|
| Roasted Seeds,Berries & Nuts Mix (7032) | Roasted Seeds, Berries & Nuts (salted) | Dry Fruits | 100g ₹283, 250g ₹708, 500g ₹1415, 1kg ₹2830 |
| Saffron Lotion (6605) | not on live site | | |
| Sidr Honey (6487) | Sidr Honey | Honey | 100g ₹320, 250g ₹800, 500g ₹1600 |
| Saffron Infused Oil (6481) | not on live site | | |
| Raisins (6347) | Raisins (Kishmish) | Dry Fruits | 100g ₹160, 250g ₹400, 500g ₹800, 1kg ₹1600 |
| Watermelon Seeds (6326) | not on live site | | |
| Cardamom (6190) | not on live site | | |
| Cumin Seeds (6183) | not on live site | | |
| Black Pepper (6177) | not on live site | | |
| Clove (6171) | not on live site | | |
| Cinnamom (6165) | not on live site | | |
| Black Forest Honey (6139) | Black Forest Honey | Honey | 100g ₹260, 250g ₹650, 500g ₹1300 |
| Saffron Honey (6110) | Saffron Honey | Honey | 100g ₹220, 250g ₹550, 500g ₹1100 |
| Saffron Atter Premium (6024) | not on live site | | |
| Flax Seeds ( Roasted) (5957) | not on live site | | |
| Chia Seeds (5953) | not on live site | | |
| Sunflower Seeds (5948) | not on live site | | |
| Pumpkin Seeds (5931) | not on live site | | |
| Saffron Face Wash (5910) | not on live site | | |
| Meethi Saunf (5904) | Sauf | Food | 100g ₹180, 250g ₹450, 500g ₹900, 1kg ₹1800 |
| Saffron & Honey Face Wash (5776) | not on live site | | |
| Rose Water (5774) | not on live site | | |
| Kesari Milk Masala (5772) | Kesari Milk Masala | Food | 100g ₹533, 250g ₹1333, 500g ₹2665 |
| Kashmiri Kahwa (5763) | not on live site | | |
| Kashmiri Kahwa {Sugar Free} (5760) | not on live site | | |
| Lavender Oil (5757) | not on live site | | |
| Walnut Oil (5752) | not on live site | | |
| Apricot Oil (5749) | not on live site | | |
| Hazel Nuts (5745) | Hazelnuts | Dry Fruits | 100g ₹500, 250g ₹1250, 500g ₹2500, 1kg ₹5000 |
| Dates (5742) | Dates | Dry Fruits | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Kaju (5734) | Cashew (Kaju) | Dry Fruits | 100g ₹320, 250g ₹800, 500g ₹1600, 1kg ₹3200 |
| Black Kishmish (5720) | Black Raisins (Kishmish) | Dry Fruits | 100g ₹140, 250g ₹350, 500g ₹700, 1kg ₹1400 |
| Dried Kiwi (5708) | Dried Kiwi | Dry Fruits | 100g ₹160, 250g ₹400, 500g ₹800, 1kg ₹1600 |
| Turkel Apricot (5703) | Turkel Apricot | Dry Fruits | 100g ₹320, 250g ₹800, 500g ₹1600, 1kg ₹3200 |
| Mix DryFruits (5698) | Mixed Dry Fruits | Dry Fruits | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| White Apricot (5693) | White Apricot | Dry Fruits | 100g ₹160, 250g ₹400, 500g ₹800, 1kg ₹1600 |
| Kashmiri Red Apricot (5687) | Kashmiri Red Apricot | Dry Fruits | 100g ₹360, 250g ₹900, 500g ₹1800, 1kg ₹3600 |
| Saffron Face Scrub (5665) | not on live site | | |
| Saffron Cream (5661) | not on live site | | |
| Roasted Fruit & Nut Mixture (5656) | Roasted Fruit & Nut | Dry Fruits | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Dried Anjeer / Dried Fig (5620) | Dried Fig (Anjeer) | Dry Fruits | 100g ₹360, 250g ₹900, 500g ₹1800, 1kg ₹3600 |
| Kashmiri Rajma (5615) | not on live site | | |
| Himalayan Garlice (5608) | not on live site | | |
| Acacia Honey (5604) | Acacia Honey | Honey | 100g ₹200, 250g ₹500, 500g ₹1000 |
| Munakka (5599) | Munakka | Dry Fruits | 100g ₹200, 250g ₹500, 500g ₹1000, 1kg ₹2000 |
| Kashmiri Gulkand (5588) | Kashmiri Gulkand | Honey | 100g ₹152, 250g ₹380, 500g ₹760 |
| Dried Cherry (5579) | Dried Cherry | Dried Berries | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Dried Blueberry Plum (5574) | Dried Blueberry Plum | Dried Berries | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Dried Blackberry (5567) | Dried Blackberry | Dried Berries | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Dried Cranberry (5563) | Dried Cranberry | Dried Berries | 100g ₹240, 250g ₹600, 500g ₹1200, 1kg ₹2400 |
| Almond (5558) | Kashmiri Mamra Almonds | Dry Fruits | 100g ₹360, 250g ₹900, 500g ₹1800, 1kg ₹3600 |
| Kashmiri Walnut Kernels (5518) | Kashmiri Walnut Kernels | Dry Fruits | 100g ₹360, 250g ₹900, 500g ₹1800, 1kg ₹3600 |
| Pure Kashmiri Mongra Saffron / Kesar (5493) | Kashmiri Mongra Saffron (Pure) | Saffron | 1g ₹800, 5g (no price), 10g ₹8000 |
| Shilajit (171) | not on live site | | |
| Almond Oil (Rogan Badam) (170) | not on live site | | |

## Live Pantry products not in the supplier list

| Live product | Category | Sizes (excl. GST) |
|---|---|---|
| Kashmir ke Blackberries (100% Pure) | Kashmiri Dry Fruits | ₹1400 (sold out) |
| Kashmiri Muesli | Healthy Breakfast | 100g ₹300, 250g ₹750, 500g ₹1500, 1kg ₹3000 |
| Kashmiri Almonds (100% Pure) | Dry Fruits | 100g ₹480, 250g ₹1200, 500g ₹2400, 1kg ₹4800 (sold out) |

Note: live "Kashmiri Mongra Saffron (Pure)" has a 5g size with no price; the seed skips it.
