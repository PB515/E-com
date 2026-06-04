# 06 — Database Schema (+ tax model from the Billing & GST module)

*Bugadi. Frozen planning doc. A home for EVERY field any flow (01) reads or writes. Postgres on Supabase, RLS on. The tax data model follows the Billing & GST module: **rates/HSN are admin-editable data, never hard-coded; the rate is snapshotted onto the invoice at sale; place-of-supply decides the split.***

> Status: **FROZEN** after sign-off. Per-table access rules are in **app-02 (Data Model & Security)** — RLS is specified there, not assumed.

---

## Tables

### tax_settings (single row — admin-editable; the "per-site data")
```
id, business_name, gstin (nullable until obtained), registered_state*, 
default_gst_rate (default 12.00), default_hsn (default '7117'), 
invoice_prefix, updated_at
```
*Why nullable GSTIN:* build proves the flow in test mode before GSTIN is obtained.

### products
```
id, slug* (unique), name*, category* (enum: ear_cuffs|earrings|bracelets|hasli|pendants),
description, 
-- killer feature (Wearable Heritage):
heritage_motif, heritage_region, heritage_occasion, heritage_story,
-- commerce:
price_inr* (GST-INCLUSIVE display price), 
hsn_code* (default '7117', ADMIN-EDITABLE), gst_rate* (default 12.00, ADMIN-EDITABLE),
material_finish, size_info, care_info,
stock_qty* (0 = out of stock), is_active*, 
created_at, updated_at
```

### product_images
```
id, product_id* (FK→products), url*, alt_text*, sort_order, is_primary
```

### customers   (guest checkout — created at checkout, no login in v1)
```
id, name*, email*, phone, created_at
```

### addresses
```
id, customer_id* (FK), line1*, line2, city*, state* (drives PLACE OF SUPPLY),
pincode*, created_at
```

### orders
```
id, order_number* (unique, human-readable), customer_id* (FK), address_id* (FK),
status* (pending|paid|cod_confirmed|fulfilled|cancelled|returned),
payment_method* (razorpay|cod),
-- TAX SNAPSHOT (written at checkout — never rewritten if a rate changes later):
place_of_supply_state*, is_intra_state* (bool),
subtotal_inr*, cgst_amount, sgst_amount, igst_amount, total_tax_amount*, grand_total_inr*,
-- gateway:
razorpay_order_id, razorpay_payment_id, 
created_at, paid_at
```

### order_items   (line-level snapshot — name/price/rate captured at sale)
```
id, order_id* (FK), product_id* (FK), product_name*, 
unit_price_inr*, qty*, hsn_code* (snapshot), gst_rate* (snapshot), line_total_inr*
```

### invoices   (the legal record — generated from the order's snapshot)
```
id, invoice_number* (unique), order_id* (FK), gstin (snapshot of seller GSTIN or null),
place_of_supply_state*, is_intra_state*,
subtotal_inr*, cgst_amount, sgst_amount, igst_amount, total_tax_amount*, grand_total_inr*,
issued_at*
```
> **Snapshot rule:** an invoice is a legal record of what was actually charged. Editing a product's rate later affects FUTURE invoices only and MUST NEVER rewrite a past one.

### subscribers   (newsletter / festive drops)
```
id, email* (unique), source, consent_at*, created_at
```

### return_requests   (7-day damaged/wrong only)
```
id, order_id* (FK), reason* (damaged|wrong_item), note, photo_url,
status* (pending|approved|rejected), created_at, reviewed_at
```

### credit_notes   (reverses GST on approved return, same FY)
```
id, return_request_id* (FK), order_id* (FK), invoice_id* (FK), 
amount_inr*, tax_reversed_inr*, credit_note_number*, issued_at*
```

### admin_users   (Supabase Auth — role-gated; see app docs)
```
managed by Supabase Auth; role claim: admin. No customer logins in v1.
```

---

## Relationships

```
customers 1───* addresses
customers 1───* orders ───* order_items *─── products
products  1───* product_images
orders    1───1 invoices
orders    1───* return_requests 1───1 credit_notes ───1 invoices
tax_settings (singleton) — read at checkout to compute the split
```

## Place-of-supply logic (computed at checkout, server-side)

```
buyer_state = addresses.state
seller_state = tax_settings.registered_state
is_intra_state = (buyer_state == seller_state)
  if intra : CGST = SGST = (gst_rate/2) of subtotal ; IGST = 0
  if inter : IGST = gst_rate of subtotal            ; CGST = SGST = 0
→ write the result onto the order (snapshot), then the invoice copies it.
```

## Field marks

- **PII:** customers (name/email/phone), addresses → Mumbai region, RLS, server-only read.
- **Server-only / never public-read:** tax_settings (GSTIN), invoices, credit_notes, all admin data, razorpay ids.
- **Public-insert via server (not public-read):** subscribers, return_requests, orders (created server-side).
- **Unique:** product.slug, order_number, invoice_number, subscriber.email, credit_note_number.

**SECURITY:** RLS on every table. Public is **insert-only via server** where needed; **no public read** of orders/customers/invoices/tax. Admin access is an explicit, separate grant (app-02). Card data never stored.

**Done when:** every "Data:" line in the Flow Map (01) has a home here. ✔ (checkout writes → orders/order_items/customers/addresses/invoices; newsletter → subscribers; returns → return_requests/credit_notes; admin → products/tax_settings.)
