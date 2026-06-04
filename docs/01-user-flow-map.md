# 01 — User Flow Map

*Bugadi · traditional Indian ornament, styled to wear today. Frozen planning doc — the skeleton every page, component, table, and image falls out of. Commerce runs in **test mode**.*

> Status: **FROZEN** after Step-3 sign-off. Change only by a deliberate, logged decision (update doc → commit separately → then build).

---

## Audience & primary action

One primary audience (Indian women ~18–40 who wear ethnic/fusion, shop mobile-first, buy for festivals/weddings/gifting). Because there is a **single primary audience**, the homepage does **not** need a segment router — its job is to merchandise the catalog and lead with heritage. Primary action: **add to cart → checkout**. Secondary: **capture email** for festive drops & restocks.

The differentiator (see 02 Killer Feature) is **Wearable Heritage** — every product page carries the piece's motif/region/occasion story. So the core shopping flow is heritage-led, not just a grid.

---

## FLOW 1 — Shop → Buy (the conversion spine)

```
Trigger:   Search / Instagram / festive intent / referral
Steps:     1. Land (home or category)
           2. Browse category (Ear cuffs · Earrings · Bracelets · Hasli · Pendants)
           3. Product page — images + price (GST-inclusive) + heritage story + Add to Cart
           4. Cart — review items, qty, subtotal
           5. Checkout — shipping address captured
           6. Tax computed by PLACE OF SUPPLY (Bugadi state vs buyer state → CGST+SGST or IGST)
           7. Pay — Razorpay hosted checkout (TEST mode: UPI/cards/netbanking) OR choose COD
           8. Webhook confirms payment (idempotent) → order marked paid
           9. Order confirmation page + email; order pushed to Shiprocket → AWB/tracking
Success:   Order row written with paid/COD status + tax snapshot; confirmation email sent
Drop-off:  Checkout (price surprise / friction). Fix: GST-inclusive prices shown on PDP;
           sticky Add-to-Cart on mobile; minimal-field checkout; COD offered.
Data:      READ  products (name, price, HSN, gst_rate, images, stock, heritage story)
           WRITE order, order_items, customer/address, payment record, invoice (tax snapshot),
                 shiprocket order ref
```

**Runtime-dependency note (v4):** steps 7–9 fetch live (Razorpay, webhook, Shiprocket). Each needs a planned fallback — see doc 10. Never mark an order paid from the client; only the idempotent webhook does.

---

## FLOW 2 — Email capture (festive drops & restocks)

```
Trigger:   Footer / exit-intent / "notify me" on out-of-stock product
Steps:     1. Enter email  2. Honeypot + server validation  3. Stored as subscriber
Success:   subscriber row written (consent_at stamped)
Drop-off:  Form friction / distrust. Fix: one field, clear value ("festive drops, no spam").
Data:      WRITE subscribers (email, source, consent_at)
```

---

## FLOW 3 — Returns request (7-day damaged / wrong only)

```
Trigger:   Item arrives damaged or wrong (NOT change-of-mind / wear)
Steps:     1. Open return form from order / returns page (order id + reason + photo)
           2. Honeypot + server validation → return request stored
           3. Admin reviews → approves → issues credit note (reverses GST, same FY)
Success:   return_request row written; on approval a credit_note row reverses the invoice GST
Drop-off:  Unclear eligibility. Fix: policy states damaged/wrong only, plainly, on PDP + page.
Data:      READ order, invoice   WRITE return_request, credit_note
```

---

## FLOW 4 — Heritage discovery (the differentiator path)

```
Trigger:   Curiosity / "our roots / the craft" content link / occasion intent
Steps:     1. Read "Our Roots / The Craft" story page
           2. Follow to a piece whose story was told → Product page (FLOW 1 step 3)
Success:   Reaches a product page with heritage intent → higher-converting entry
Data:      READ content (roots/craft), products (heritage story fields)
```

---

## FLOW 5 — Admin operations (authenticated — see PART 7 app docs)

```
Trigger:   Founder/admin logs in
Steps:     1. Login (auth)  2. Dashboard
           3a. Products: create/edit (name, price, photos, category, stock, HSN, GST rate, story)
           3b. Orders: view, mark fulfilled, push/track via Shiprocket
           3c. Tax settings: GSTIN, registered state, default rate (admin-editable)
           3d. Invoices: view/generate from the order's tax snapshot
           3e. Returns: approve → issue credit note
Success:   Catalog/orders/tax managed without a code change or redeploy
Denial gate: a logged-out visitor OR a customer CANNOT reach any /admin route or data.
Data:      READ/WRITE products, orders, invoices, tax_settings, return_requests, credit_notes
```

---

## Coverage check (every page/feature appears in a flow)

| Surface | Appears in |
|---|---|
| Home, Category, Product, Cart, Checkout, Confirmation | Flow 1 |
| Newsletter capture | Flow 2 |
| Returns page/form | Flow 3 |
| Our Roots / The Craft content | Flow 4 |
| Admin: products, orders, tax settings, invoices, returns | Flow 5 |
| Killer feature (Wearable Heritage) | Flow 1 step 3 + Flow 4 |

**Done when:** every page/feature about to be built appears above. ✔ (03b's page list is the authoritative enumeration; this map predicts movement.)
