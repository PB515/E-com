# Phase 4 — Account & Keys Setup (your track)

*What you need, where to get it, and where to put it. The agent never creates accounts or holds keys — these steps are yours. Everything stays in **test mode** (no real money) until you decide to go live.*

> **Two places keys go:**
> 1. **Local dev** → the file **`.env.local`** in the project root (already created for you, with blank values). Edit it in a text editor (VS Code). It is gitignored — never committed.
> 2. **Production** → **Vercel → your `e-com` project → Settings → Environment Variables**. Add the same names/values there, then redeploy. (Do this when we go live; local is enough to build Phase 4.)
>
> **Rules:** never paste a key into chat or a screenshot. Anything marked *server-only* must never get a `NEXT_PUBLIC_` prefix. If a secret is ever exposed, rotate it.

---

## 1. Supabase — database + admin login

**What it's for:** stores products, orders, invoices, customers; runs the admin login and the row-level security that keeps customer data private.

**Get it:**
1. Go to **https://supabase.com** → sign in → **New project**.
2. Name it (e.g. `bugadi`), set a database password (save it), and pick region **Mumbai (ap-south-1)** — important for India DPDP.
3. Wait for it to provision, then open **Project Settings → API**. Copy:
   - **Project URL**
   - **anon / public** key (the publishable client key)
   - **service_role** key (the secret server key — keep private)
   *(Supabase has been renaming these to "Publishable key" / "Secret key" — if you see those, Publishable = anon, Secret = service_role.)*
4. Open **SQL Editor → New query**, paste the contents of **`supabase/migrations/0001_init.sql`** from this repo, and **Run**. That creates the tables, security rules, and seeds the 11 products.

**Put in `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=        ← Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   ← anon / publishable key
SUPABASE_SERVICE_ROLE_KEY=       ← service_role / secret key   (server-only)
```

*(Making yourself the admin: after you've created your login, I'll give you a one-line SQL to add your user id to `admin_users`. We do that during the build.)*

---

## 2. Payments — MOCK now, Razorpay LATER

**Decision:** we use a **mock payment provider** for now (no gateway account needed) and integrate real Razorpay later. Because payments sit behind an adapter (`lib/payments/`), the switch later is one env var (`PAYMENT_PROVIDER=razorpay`) plus the keys below — no checkout rewrite.

**Now:** nothing to get. `PAYMENT_PROVIDER=mock` is already set in `.env.local`. The mock runs the full real shape: create order → simulate success/fail → a **signed, idempotent confirmation marks the order paid** (no card data, no real money). COD works without any gateway.

**Later (when you've decided the Razorpay business details):** razorpay.com → Dashboard → **Test Mode** → Settings → API Keys → Generate Test Key (`rzp_test_…` + secret); add a webhook to `https://e-com-tan-ten.vercel.app/api/webhooks/razorpay` with a secret you choose. Then fill the Razorpay block in `.env.local` and set `PAYMENT_PROVIDER=razorpay`.
```
RAZORPAY_KEY_ID=             ← rzp_test_...            (later)
NEXT_PUBLIC_RAZORPAY_KEY_ID= ← the same rzp_test_ id   (later)
RAZORPAY_KEY_SECRET=         ← the secret             (later, server-only)
RAZORPAY_WEBHOOK_SECRET=     ← the webhook secret      (later, server-only)
```

---

## 3. Shiprocket — shipping (pan-India)

**What it's for:** generating shipping labels/AWB, pickups, tracking, COD remittance.

**Get it:**
1. Go to **https://www.shiprocket.in** → create a seller account (you'll add your GST/pickup details later, before full launch).
2. In the panel: **Settings → API → Configure** → **Create an API User**. This makes a **separate email + password** used only for API access (not your main login).

**Put in `.env.local`:**
```
SHIPROCKET_EMAIL=     ← the API user email      (server-only)
SHIPROCKET_PASSWORD=  ← the API user password   (server-only)
```

---

## 4. Resend — order-confirmation email

**What it's for:** sending the order confirmation (and return updates).

**Get it:**
1. Go to **https://resend.com** → sign up.
2. **API Keys → Create API Key** → copy it (`re_…`).
3. *(Sending domain:* until you verify a domain (**Domains → Add Domain**), Resend only delivers to **your own** signup email — fine for test mode. We verify a real domain before full launch so it reaches customers.*)*

**Put in `.env.local`:**
```
RESEND_API_KEY=   ← re_...   (server-only)
```

---

## What I've already built (no keys needed)
- `supabase/migrations/0001_init.sql` — the full schema + security rules + product seed (you run it in step 1).
- `lib/tax.ts` — the GST place-of-supply calculation (verified: intra-state → CGST+SGST, inter-state → IGST, on GST-inclusive prices).
- `lib/supabase/{client,server,admin}.ts` — the Supabase connections (read keys by name).
- `lib/payments/` — the payment adapter boundary + a working **mock** provider (and the real Razorpay adapter ready behind the same interface for the later swap).

## Exactly what's needed NOW (to start the build)
1. **Supabase — all three** keys, not just one: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API). The URL + anon key are the two still empty.
2. **Run the migration** `supabase/migrations/0001_init.sql` in Supabase SQL Editor.
3. **Shiprocket** (`SHIPROCKET_EMAIL`/`PASSWORD`) and **Resend** (`RESEND_API_KEY`) — needed for the shipping + email steps; can come while I build the first part.
4. Payments: nothing — mock is on.

## When `.env.local` has the Supabase three + the migration is run
Tell me, and I build Phase 4 security-first (per `docs/app-03`):
**auth → row-level security → prove a logged-out / cross-user can't reach admin or order data → then** catalog-from-Supabase, checkout (place-of-supply GST + **mock** payment + idempotent confirmation + invoice snapshot), Shiprocket, the confirmation email, and the admin screens.
