# app-02 — Data Model & Security (RLS specified, not assumed)

*Bugadi. The schema (06) PLUS, for every table, who may read/write which rows. **Deny by default** — a row is invisible unless a rule explicitly grants access. Supabase Postgres RLS, Mumbai region.*

---

## Principle

Every table starts **closed**: no access unless a policy grants it. Public writes happen **through the server** (service role / server actions), not via public client policies. Admin access is a **separate, explicit grant** keyed on the `admin` role. The opposite — open-by-default, lock-down-later — guarantees a forgotten table; we do not do it.

## Per-table access rules

| Table | Public (anon) | Server (service role) | Admin (authenticated, role=admin) |
|---|---|---|---|
| products | **read** active rows only (`is_active=true`) | full | full (create/edit incl. HSN/rate/story) |
| product_images | read (for active products) | full | full |
| tax_settings | **none** | read (to compute tax) | **read/write** (GSTIN/state/rate) |
| customers | **none** | insert/read (checkout) | read |
| addresses | **none** | insert/read (checkout) | read |
| orders | **none** (no public read) | insert/update (create + webhook mark-paid) | read/update (fulfil) |
| order_items | **none** | insert/read | read |
| invoices | **none** | insert/read (generate) | read |
| subscribers | **none** (insert via server only) | insert | read |
| return_requests | **none** (insert via server only) | insert/read | read/update (approve/reject) |
| credit_notes | **none** | insert | read/create |

**Notes**
- "Public read products" is the **only** public read, and only for **active** rows — drafts/inactive stay hidden.
- Order confirmation (`/order/[id]`) is served **server-side**: the server reads the single order by id and renders it; there is **no public client read** of `orders`, and the id is a non-guessable token (e.g. uuid/order_number), not a sequential int exposed to enumeration.
- The **webhook** updates `orders.status` to paid via the service role only — never the client. Idempotent (ignore duplicate/late events for an already-paid order).
- GSTIN in `tax_settings` and all financial records (`invoices`, `credit_notes`) are **admin-only**.

## Auth

- Supabase Auth for admin login. `admin` role asserted via a custom claim / a row in an `admin_users`/role table checked by RLS policies and by the `/admin` route guard (middleware).
- **Deny-by-default route guard:** every `/admin/*` route checks the session + admin role server-side; no session or no admin role → redirect to `/admin/login`. Never rely on hiding UI alone.

## Secrets & boundaries

- All keys (Razorpay, Shiprocket, Supabase service role, Resend) in `.env.local` / host env — **server-side only**, never in the client bundle.
- Card data never reaches our server (Razorpay hosted checkout).
- Provider calls only inside `lib/payments/razorpay` and `lib/shipping/shiprocket`.

## The denial test (must pass — see app-03)

```
1. Logged out → GET /admin, /admin/orders, admin API → REDIRECT/403 (not 200)
2. As a non-admin session → same → DENIED
3. Guess another order id at /order/<id> → only your own resolves; ids non-enumerable
4. Inspect client bundle/network → no service-role key, no GSTIN leak, no card data
```
