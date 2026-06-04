# 02 — PRD (Product Requirements) + No-List + Killer Feature + Conversion

*Bugadi — traditional Indian ornament, styled to wear today. Frozen planning doc. Commerce in **test mode**.*

> Status: **FROZEN** after sign-off.

---

## GOAL (one sentence)

Sell oxidised (antique-finish) Indian jewellery online — pan-India, mobile-first — by making each piece feel like **wearable heritage**, converting browse → add-to-cart → checkout, with a compliant GST + payments + shipping rail behind it.

---

## KILLER FEATURE — "Wearable Heritage" product pages

The gap competitors share: oxidised sellers use heritage *language* in marketing, but provenance is **not structural** to the product page — it's decoration on a generic grid. Bugadi makes it structural: **every SKU carries a short, real heritage story — its motif, region, and the occasion it belongs to** — rendered as a first-class section on the product page, plus an "Our Roots / The Craft" content piece that links into the catalog.

This is the north star: the brand name *is* a *bugadi* (a traditional ear ornament). The customer isn't buying a trinket; she's buying a piece of heritage she can wear now. Build consequence: product descriptions are richer than a typical store's, and `content/` earns its place.

*(Quality/finish are table stakes — the oxidised finish must hold up — and the catalog stays a considered edit, not an endless dump. But the **lead** is story and provenance, not price or breadth.)*

---

## COMPETITORS (from research — directional)

| Brand | Price signal | What they do well | Gap to exploit |
|---|---|---|---|
| Ishhaara | Earrings ~₹499–several ₹k | Styling notes, heritage motifs in copy | Story is marketing, not per-product structure |
| Rubans | Studs ~₹1,250; necklaces from ₹350 | Poetic labels, omnichannel | Generic poetic copy, not piece-specific provenance |
| Teejh | German-silver ₹199–₹799 (heavy sale) | Craft/artisan names, value pricing | Discount-led; brand story thin |
| Voylla (blog) | — | "Timeless art," lotus/peacock heritage framing | Breadth over considered edit |

**Pattern to copy:** storytelling in product copy; motif + regional origin. **Pattern to avoid:** endless catalog dumps, discount-shouty positioning, ₹50–100 "junk" price points that erode quality perception. **The shared gap → the Killer Feature above.**

**Indicative price bands** (placeholders until real SKUs/prices loaded — see No-List rule): Ear cuffs/earrings ₹250–₹900 · Bracelets ₹300–₹1,200 · Pendants ₹300–₹1,000 · Hasli/statement ₹800–₹2,500. All prices are **GST-inclusive** on display; the 12% is computed and shown as a line at checkout.

---

## CONVERSION STRATEGY

- **Primary CTA:** Add to Cart → Checkout.
- **Secondary CTA:** "Notify me / festive drops" email capture (for the not-yet-ready and out-of-stock).
- **The one belief a visitor must hold:** *"This is real heritage jewellery, the finish will hold up, and buying is safe and easy."*
- **Top objections + how the page answers each:**
  1. *"Is the oxidised finish cheap / will it tarnish?"* → finish/material note + care info on PDP; considered-edit framing; real photography front and centre.
  2. *"Is this just a generic dropship trinket?"* → the per-product heritage story (motif/region/occasion) + Our Roots content.
  3. *"Is paying / returns safe?"* → GST-inclusive pricing shown, trusted payment (Razorpay) + COD, plain 7-day damaged/wrong return policy on the PDP itself.

---

## V1 FEATURES (phased)

**MVP / Phase 1–4**
- Catalog: 5 categories (Ear cuffs, Earrings, Bracelets, Hasli, Pendants), seeded with representative placeholder SKUs.
- Product page with Wearable Heritage story, images, GST-inclusive price, Add to Cart.
- Cart + Checkout with shipping address → place-of-supply GST computation.
- Razorpay **test-mode** hosted checkout + COD; idempotent webhook → order paid.
- Order confirmation + transactional email; Shiprocket order creation (test) → AWB/tracking.
- Compliant invoice with **snapshotted** HSN + rate + CGST/SGST/IGST.
- Admin (auth): products (incl. HSN + GST rate), orders, tax settings, invoices, returns.
- Email capture (festive drops). Returns request (damaged/wrong) + credit-note-on-approval.
- "Our Roots / The Craft" content piece.

**Phase 5 (Polish)**
- Responsive to 360px, real empty/loading/error states, SEO, a11y, performance, analytics.

**Later (Phase 2/3 — post-v1)**
- Wishlist, product reviews, filters/sort beyond category, discount codes, related-product engine, gifting/wrapping, accounts for customers (guest checkout is v1 default).

---

## NO-LIST (explicitly NOT in v1)

- ❌ Precious-metal / hallmarked fine jewellery — oxidised/imitation only.
- ❌ International shipping — India only at launch.
- ❌ Custom/bespoke orders.
- ❌ Third-party sellers / marketplace — single-brand store (so **no marketplace TCS**).
- ❌ Customer login accounts in v1 — **guest checkout** (admin auth only).
- ❌ GST **filing** (GSTR returns) — the site does point-of-sale GST (charge + invoice); filing is off-site accounting.
- ❌ Change-of-mind / wear-and-tear returns — damaged/wrong only.
- ❌ Wishlist, reviews, loyalty, advanced filtering — deferred.

---

## FORM SECURITY (applies to every public form — newsletter, returns, checkout)

- **Honeypot** field (hidden from humans; filled by bots → silently rejected).
- **Server-side validation** — re-check every field on the server (bots skip the browser).
- **Rate limiting** on submissions.
- Card data **never touches our server** (Razorpay hosted checkout only).

---

## SUCCESS METRIC

v1 (test mode) proves the rail end-to-end: a test order completes checkout → webhook marks it paid → a **correct invoice** (right place-of-supply split, snapshotted rate) is produced → Shiprocket order created. Post-launch funnel metric: **add-to-cart → checkout-completed conversion rate** (see doc 11 events).

---

## ⚠️ Legally sensitive — human review before *full* launch (not soft launch)

- GST rate (12%), HSN (7117), invoice format, place-of-supply split — **CA verifies** on one intra-state and one inter-state sample invoice.
- GSTIN obtained + entered before truly live (build proves the flow without it).
- Privacy policy real once any PII collected (DPDP) and matching the analytics deployed.
- Returns/credit-note wording.

**Done when:** any proposed feature is instantly classifiable as MVP / Phase 2 / No-List, and the primary CTA + the one belief are each stateable in a sentence. ✔
