# app-03 — App Build Roadmap (security-first order)

*Bugadi. The authenticated parts (admin + private order/payment data) are built **security-first, not features-first.** This sequences Phase 4 of the main roadmap (08). Auth and access rules are the foundation, not the finish.*

---

## The proven sequence (do not reorder)

```
1. AUTH FIRST     — admin login / logout / session works, before any private data screens exist
2. ACCESS RULES   — define and ENABLE RLS on every table per app-02; deny-by-default;
                    add the server-side /admin/* route guard (middleware)
3. PROVE DENIAL   — log out / use a non-admin session, attempt to read admin & order data
                    (by URL, by API, by id-guess) → confirm every attempt FAILS  ← GATE
4. THEN FEATURES  — only once denial is proven, build the admin screens + the order/payment
                    write paths on top
```

Features-first is the classic trap: build dashboards, wire data, bolt on access control last — by which point a leak is buried under everything.

---

## Phase 4 sub-steps (in order)

**4a — Auth**
- [ ] Supabase Auth admin login/logout/session; `/admin/login`.
- [ ] Admin provisioned manually (no self-signup).

**4b — Access rules (deny-by-default)**
- [ ] RLS enabled on EVERY table; policies per app-02 (only "active products" public-readable).
- [ ] `/admin/*` server-side route guard (no session / no admin role → redirect).
- [ ] Secrets server-side only; service role never in client bundle.

**4c — PROVE cross-user / logged-out denial  ← NON-NEGOTIABLE GATE**
```
[ ] Logged out → /admin, /admin/orders, admin APIs → redirect/403 (not 200)
[ ] Non-admin session → admin data → DENIED
[ ] /order/<id> → only the buyer's own order resolves; ids non-enumerable
[ ] No service-role key / GSTIN / card data in the client bundle or network tab
```
**Do not build any admin or order-data feature until 4c passes.**

**4d — Features (now safe to build)**
- [ ] Catalog reads from Supabase (replaces seed); admin product editor (HSN/rate/story).
- [ ] Checkout: capture address → compute place-of-supply → write **tax snapshot** to order/invoice.
- [ ] Razorpay TEST hosted checkout + COD; **idempotent webhook** marks paid (server-only).
- [ ] Order confirmation (server-rendered by id) + Resend email; Shiprocket test order (adapter).
- [ ] Tax settings admin-editable (GSTIN/state/rate); rate edit → future invoices only.
- [ ] Returns review → credit note (reverses GST). Newsletter persist.
- [ ] Forms: honeypot + server validation + rate limit (`lib/security.ts`).

---

## Acceptance gate for Phase 4

Every line in 4c passes **and** the commerce checks in doc 10 pass (tax read-from-data + snapshot, webhook-only-paid, adapter boundary). Re-run the denial test whenever a new admin or order-data feature is added.

> **Carried must-hold:** this is a payments build — the denial gate + the webhook-only-paid + card-data-off-server rules are what make "it works for me" into "it's safe for everyone."
