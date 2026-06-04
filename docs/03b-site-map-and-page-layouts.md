# 03b — Site Map & Page Layouts  ⟶ **APPROVE BEFORE IMAGES OR CODE**

*Bugadi. The skeleton you sign off before anything is generated. 06b (Image Plan) is counted FROM this page list (instance-level).*

> Status: **AWAITING SIGN-OFF (Step 3b gate).** Approve site structure · every page listed · every nav item navigate-or-scroll · every page's section order — then freeze.

---

## Job 1 — Site Structure

**MULTI-PAGE** (standard e-commerce). *Why:* a store needs per-category and per-product routes so each product/category can target its own search terms and be linked/shared directly; a single-page store can't do product URLs or SEO. One hybrid touch: footer "newsletter" can scroll.

---

## Job 2 — Page / route list + nav behaviour

```
STOREFRONT (public)
  /                         Home
  /shop                     All products (index)
  /category/[slug]          Category listing  × 5 instances:
                              ear-cuffs · earrings · bracelets · hasli · pendants
  /product/[slug]           Product detail (PDP)  — one per SKU (seeded set)
  /cart                     Cart
  /checkout                 Checkout (address → tax → pay)
  /order/[id]               Order confirmation
  /our-roots                Our Roots / The Craft (heritage content — killer feature support)
  /returns                  Returns policy + request form
  /shipping                 Shipping & delivery info (Shiprocket, India-only, COD)
  /privacy                  Privacy policy (DPDP)
  /terms                    Terms / store policies
  /contact                  Contact

ADMIN (authenticated — deny-by-default)
  /admin/login              Login
  /admin                    Dashboard
  /admin/products           Product list + create/edit (incl. HSN + GST rate + story)
  /admin/orders             Orders list + detail (+ Shiprocket push/track)
  /admin/tax-settings       GSTIN · registered state · default GST rate (admin-editable)
  /admin/invoices           Invoice list/view (from order tax snapshot)
  /admin/returns            Return requests → approve → credit note

SYSTEM
  404 · error · empty states (global)
```

**NAV ITEMS (header):**
```
Shop          → /shop                 (navigates)
Ear Cuffs     → /category/ear-cuffs   (navigates)   ┐
Earrings      → /category/earrings    (navigates)   │ may be a "Shop ▾" dropdown
Bracelets     → /category/bracelets   (navigates)   │ on desktop; full list in
Hasli         → /category/hasli       (navigates)   │ mobile hamburger
Pendants      → /category/pendants    (navigates)   ┘
Our Roots     → /our-roots            (navigates)
Cart          → /cart                 (navigates, with item-count badge)
```
**Footer:** Shop categories · Our Roots · Shipping · Returns · Privacy · Terms · Contact · **Newsletter capture** (festive drops).

---

## Job 3 — Section order per page

```
HOME
  1. Hero            — brand line ("traditional ornament, styled to wear today") + primary CTA to Shop
  2. Category grid   — 5 categories as cards (icons/representative shots) → /category/[slug]
  3. Featured pieces — a considered edit of representative SKUs (product cards)
  4. Heritage strip  — short "Our Roots" teaser → /our-roots (the differentiator)
  5. Trust strip     — India shipping · COD · secure payment · 7-day damaged/wrong returns
  6. Newsletter band — festive drops capture
  7. Footer

CATEGORY PAGE (template — all 5)
  1. Category header (name + one-line description)  2. Product grid (cards)
  3. Empty state if none  4. Newsletter band  5. Footer

PRODUCT PAGE / PDP (template — every SKU)
  1. Gallery (swipeable, zoom)            2. Title · price (GST-incl.) · Add to Cart (sticky on mobile)
  3. **Heritage Story** (motif · region · occasion — killer feature)
  4. Details (material/finish/size/care — bullets)  5. Shipping & returns note (plain)
  6. Related pieces  7. Footer

CART
  1. Line items (image, name, qty stepper, price)  2. Summary (subtotal, GST-incl. note)
  3. Checkout CTA / empty-cart state  4. Footer

CHECKOUT
  1. Contact + shipping address (incl. State select → place-of-supply)
  2. Order summary  3. Tax line (CGST+SGST or IGST, computed)  4. Payment (Razorpay test / COD)
  5. Place order  (loading/failed states per doc 10)

ORDER CONFIRMATION (/order/[id])
  1. Success header + order id  2. Summary + tax breakdown  3. What happens next (shipping)  4. Footer

OUR ROOTS (content)
  1. Intro (the bugadi story / the craft)  2. Motif/region vignettes  3. CTA into Shop  4. Footer

RETURNS · SHIPPING · PRIVACY · TERMS · CONTACT (simple content/template)
  1. Heading  2. Body content (+ form on /returns and /contact)  3. Footer

ADMIN PAGES (template — functional, minimal chrome)
  Login → form only.  Others → 1. Admin nav  2. Page table/form  3. Empty/loading/error states
```

---

## Kept distinct from Flow Map (01)

01 *predicts movement*; this doc *declares structure*. **This page list is authoritative** and is what 06b counts from.

**Done when:** structure declared with a reason ✔ · every page listed ✔ · every nav item marked ✔ · every page has a section order ✔ · **and you sign off before images/code.** ⟶ awaiting your approval.
