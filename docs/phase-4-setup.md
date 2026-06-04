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

## 2. Razorpay — payments (TEST mode)

**What it's for:** the checkout payment (UPI / cards / netbanking) and COD. **Test mode** means the full real flow with no real money.

**Get it:**
1. Go to **https://razorpay.com** → sign up → open the **Dashboard**.
2. Flip the top toggle to **Test Mode**.
3. **Settings → API Keys → Generate Test Key**. Copy the **Key Id** (`rzp_test_…`) and **Key Secret** (shown once — save it).
4. *(Webhook — we set this up together once the site has its URL:* **Settings → Webhooks → Add**, URL `https://e-com-tan-ten.vercel.app/api/webhooks/razorpay`, you choose a **secret** string → that becomes `RAZORPAY_WEBHOOK_SECRET`.*)*

**Put in `.env.local`:**
```
RAZORPAY_KEY_ID=             ← rzp_test_...            (server)
NEXT_PUBLIC_RAZORPAY_KEY_ID= ← the same rzp_test_ id   (safe on client)
RAZORPAY_KEY_SECRET=         ← the secret             (server-only)
RAZORPAY_WEBHOOK_SECRET=     ← the webhook secret you choose (set when we add the webhook)
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
- The adapter boundaries (`lib/payments/razorpay`, `lib/shipping/shiprocket`) are stubbed and get filled during the build.

## When you've filled `.env.local`
Tell me, and I'll build Phase 4 in the security-first order (per `docs/app-03`):
**auth → row-level security → prove a logged-out / cross-user can't reach admin or order data → then** the catalog-from-Supabase, the checkout (place-of-supply GST + Razorpay test + idempotent webhook + invoice snapshot), Shiprocket, the confirmation email, and the admin screens.

> You only need **Supabase** filled to start (auth + data + the denial gate). Razorpay/Shiprocket/Resend are needed a bit later in the same phase, so you can add them while I build the first part.
