# Bugadi — Features Built

*Complete inventory of what the Bugadi e-commerce site does today. Live in production (soft launch, **test mode** — real flow, no real money). Updated 2026-06-05.*

**Live:** https://e-com-tan-ten.vercel.app · **Admin:** /admin/login

---

## Tech stack
- **Next.js 16** (App Router, TypeScript) · **Tailwind v4** (CSS-variable design tokens)
- **Supabase** — Postgres + Auth + Row-Level Security + Storage (Mumbai / ap-south-1)
- **Payments** behind an adapter — **mock provider now**, real **Razorpay (test)** ready behind the same interface (one env flag)
- **Shiprocket** (shipping adapter) · **Resend** (email) · **Motion** (framer-motion) · **Phosphor** icons
- **Vercel** hosting with GitHub auto-deploy · built with the `design-taste-frontend` skill

---

## Storefront (customer-facing)
- **Homepage** — heritage hero, 5-category grid, featured products rail (live from DB), "Our Roots" teaser, trust strip (shipping/COD/secure/returns), newsletter band, footer
- **5 category pages** — `ear-cuffs · earrings · bracelets · hasli · pendants`, product grids read live from the database
- **Product pages (PDP)** with:
  - image gallery (real uploaded photo, or a styled placeholder)
  - price (GST-inclusive), quantity stepper, **Add to bag** + a **mobile sticky bar**
  - **"Wearable Heritage" story block** (motif · region · occasion) — the killer feature
  - details (material/size/care), shipping & returns note, related pieces
  - **Product structured data (JSON-LD)** for SEO
  - **Sold-out** state when stock is 0
- **Shop-all** page · **Our Roots** heritage content page
- **Policy/info pages** — Shipping, Returns (with request form), Privacy, Terms, Contact (with form)
- **Design** — dark editorial "oxidised silver on near-black", heritage serif (Cormorant) + clean sans, restrained motion (entrance + scroll-reveal, honors reduced-motion)
- **Responsive** to 360px · global **404 / error / loading** states · per-page SEO titles + meta

## Cart
- Client-side cart, **persists across reloads** (localStorage)
- Line items, quantity stepper (race-safe), remove, **calculated GST amount shown**, subtotal
- Header **cart badge** with live count · empty + loading states

## Checkout & payments
- Contact + shipping address form with **State selector**
- **Live GST transparency** — as you pick your state, it shows the actual **CGST + SGST** (same state as the store) or **IGST** (other state) split, before paying
- **Place-of-supply GST** computed server-side: buyer's state vs the store's registered state
- Payment options: **Pay online (test/mock)** or **Cash on delivery**
- **Mock payment** runs the full real shape: create order → simulate success/fail → **signed, idempotent confirmation** marks the order paid (the same path real Razorpay's webhook will use)
- **Card data never touches the server**; real Razorpay swaps in via `PAYMENT_PROVIDER=razorpay` (+ a signature-verified webhook route already built)
- **Order confirmation page** (reached by a non-guessable order id) with the full GST breakdown

## Orders, invoices & GST (billing rail)
- Server **re-reads price/stock from the DB at checkout** — never trusts client-sent prices
- Order written with a **tax snapshot** (CGST/SGST/IGST, taxable value, totals) + line-item snapshots (**HSN 7117, rate 12%** captured at sale)
- **Invoice** generated from the snapshot — **idempotent** (exactly one per order); a later rate change affects future invoices only
- **Stock auto-decrements** on each confirmed sale; at 0 the product shows **sold out on its own**
- **Order confirmation email** (Resend, best-effort) · **Shiprocket** order push (best-effort)

## Admin (authenticated dashboard)
- **Secure login** (Supabase Auth), logout, admin-role gate; logged-out and non-admin users are blocked (**proven**)
- **Dashboard** — counts (orders, products, pending returns, subscribers) + recent orders
- **Products** — list with thumbnails + Live/Sold-out/Hidden status; **create**, **edit** (price, stock, HSN, GST rate, active, featured, motif/region/occasion, heritage story, material/size/care), **upload product image** (Supabase Storage), **mark sold out / set stock**, **delete** (guarded if the product is in an order)
- **Orders** — list + detail (customer, address, items, GST breakdown, invoice no.), **mark fulfilled**
- **Tax settings** — **admin-editable** GSTIN, registered state, default GST rate, default HSN (snapshotted onto invoices)
- **Invoices** — list with the CGST/SGST-or-IGST split and totals
- **Returns** — list of requests; **approve → issues a credit note that reverses the GST**, or reject

## Forms & data capture
- **Newsletter** signup → stored (subscribers) · **Returns** request → stored (return_requests)
- **Honeypot + server-side validation** on public forms (rate-limiting is a planned hardening item)
- Contact form (currently UI-only)

## Security
- **Row-Level Security on every table**, deny-by-default: the public can read only active products + their images; everything else is admin-only or server-only
- Admin reads/writes gated by an `is_admin()` rule + middleware + a route-group guard
- **Service-role key is server-only**; the browser uses the publishable key
- Card data off-server; the webhook/confirmation is the only thing that marks an order paid (idempotent)

## Operations
- **Single source of truth** in our own database (orders/invoices/customers/tax), providers behind thin **adapters** — switching gateway or courier is a one-module change
- GitHub → Vercel **auto-deploy**; env vars in Vercel (prod) and `.env.local` (dev)

---

## Not in v1 (by decision)
International shipping · customer login accounts (guest checkout) · marketplace/3rd-party sellers · GST filing (point-of-sale GST only) · precious/hallmarked jewellery.

## Before full (non-test) launch
Real product photos + final prices · GSTIN + CA-verified sample invoice · Resend domain verification · Shiprocket pickup config · flip to real Razorpay · form rate-limiting · privacy-policy review.
