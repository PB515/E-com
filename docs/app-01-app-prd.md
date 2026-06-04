# app-01 — App PRD (roles & private data)

*Bugadi is an authenticated app: it has an **admin** behind a login, and it holds **private per-customer data** (orders, addresses, invoices). This layers onto the core PRD (02) — same docs/loop/rails, higher security bar. The failure mode here isn't a cosmetic bug; it's one party seeing another's data.*

---

## Roles

| Role | Auth | Can see / do | Must NOT see |
|---|---|---|---|
| **Visitor / Customer (guest)** | none (guest checkout) | Browse catalog; place an order; see **their own** order confirmation via the order link they receive; submit newsletter/returns forms | Anyone else's order/customer/invoice data; any `/admin` route or admin data; tax_settings GSTIN |
| **Admin (founder/staff)** | Supabase Auth, `admin` role | Manage products (incl. HSN + GST rate + story), view all orders, push/track Shiprocket, edit tax settings (GSTIN/state/rate), view/generate invoices, review returns → issue credit notes | — (full admin within the store; never customers' card data — that never exists on our server) |

*v1 has **no customer login** — guest checkout only. Order confirmation is reached via the order id link/email, not an account. So the only authenticated role is **admin**.*

## Data that must stay private (deny-by-default)

- **orders, order_items, addresses, customers, invoices, credit_notes, return_requests** — never publicly readable. Created/served server-side; admin-readable only.
- **tax_settings (GSTIN)** — admin-only.
- **razorpay ids / payment refs** — server-only.
- **Card data** — never stored anywhere (Razorpay hosted checkout).

## No-List (security-relevant, v1)

- ❌ No customer accounts/profiles (no public auth surface to harden beyond admin).
- ❌ No public read API over orders/customers.
- ❌ No admin self-signup — admin users are provisioned manually by the founder.
- ❌ No role beyond `admin` in v1 (staff vs admin split deferred).

## Acceptance (the security bar)

- A logged-out visitor and a non-admin **cannot** reach any `/admin` route or admin data — by URL, by API, by id-guessing. **Proven** before any admin feature ships (see app-03 gate).
- An order link exposes only **that** order, nothing enumerable to neighbouring orders.

> ⚠️ This is the highest-risk area of the build. The cross-user / logged-out **denial gate** (app-03) is non-negotiable.
