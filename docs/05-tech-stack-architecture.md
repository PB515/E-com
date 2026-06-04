# 05 — Tech Stack + Architecture

*Bugadi. Frozen planning doc. Decisions WITH reasons (the reasoning is what stops 11pm second-guessing), + a living architecture sketch. Commerce in **test mode**.*

> Status: **FROZEN** after sign-off. **No dependency add OR upgrade without asking** (no `npm update`, no version bumps). Verify version-sensitive facts against official docs before relying on them.

---

## (a) Decisions with reasons

```
Framework:    Next.js (App Router, TypeScript)
              — SSR/SSG for SEO on product/category pages; API routes host the
                Razorpay webhook server-side; next/image optimizes product photos;
                deploys per-branch on Vercel (pairs with the phase workflow).

Styling:      Tailwind CSS + CSS variables (design tokens from doc 04)
              — tokens enforce brand consistency mechanically; utility classes keep
                components small and reviewable.

Database/Auth: Supabase (Postgres + Auth + Row-Level Security), region MUMBAI (ap-south-1)
              — Postgres grows into orders/invoices/returns without re-platforming;
                RLS gives deny-by-default per-row access for the admin/customer split;
                Auth covers the admin login; Mumbai region satisfies India DPDP.

Email:        Resend (transactional — order confirmation, return updates)
              — simple API; a sending domain must be verified before mail reaches
                anyone but our own inbox (launch gate).

Payments:     Razorpay — TEST MODE (rzp_test_…); UPI/cards/netbanking + COD
              — India-primary; hosted checkout means CARD DATA NEVER TOUCHES OUR SERVER.
                Behind an ADAPTER: lib/payments/razorpay.

Shipping:     Shiprocket — pan-India label/AWB, pickup, tracking, COD
              — India logistics standard. Behind an ADAPTER: lib/shipping/shiprocket.

Motion:       Framer Motion (the motion layer) — named pieces only (doc 04).

Hosting:      Vercel — per-branch preview deploys; env keys in host settings (not code);
                cookieless Vercel Analytics available.

Analytics:    Cookieless baseline (see doc 11) — no consent banner, clean DPDP story.
```

**Region/compliance:** India DPDP → Supabase **Mumbai (ap-south-1)**. Cheap to set at creation, expensive to move. Recorded here.

---

## (b) Architecture sketch

```
                         ┌────────────────────────────────────────────┐
   Shopper (mobile)      │              NEXT.JS (Vercel)               │
        │  HTTPS         │                                            │
        ▼                │  Storefront (SSR/SSG)   Admin (auth-gated)  │
  ┌───────────┐          │   home/category/PDP      products/orders/   │
  │  Browser  │◀────────▶│   cart/checkout          tax-settings/      │
  └───────────┘          │                          invoices/returns   │
        │                │            │                    │           │
        │                │            ▼                    ▼           │
        │                │     ┌─────────────── server ───────────────┐│
        │                │     │ API routes / server actions          ││
        │                │     │  • checkout: compute place-of-supply ││
        │                │     │  • create order (server)             ││
        │                │     │  • /api/webhooks/razorpay (idempotent)││
        │                │     │  • lib/security.ts (honeypot/validate/││
        │                │     │    rate-limit)                       ││
        │                │     └───┬───────────┬───────────┬──────────┘│
        └────────────────│─────────│───────────│───────────│───────────┘
   (Razorpay hosted      │         ▼           ▼           ▼
    checkout — card  ────┼──▶ ADAPTERS    Supabase     Resend (email)
    data off our server) │   lib/payments/  (Postgres   ─ order conf.
                         │   razorpay       + Auth + RLS,
                         │   lib/shipping/  Mumbai)
                         │   shiprocket   ── products, orders, order_items,
                         │       │            invoices(tax snapshot), customers,
                         │       ▼            addresses, tax_settings,
                         │  Razorpay /        subscribers, return_requests,
                         │  Shiprocket APIs   credit_notes
                         │  (TEST keys)
                         └──────────────────────────────────────────────

  ── later-phase zone (dashed): customer accounts, wishlist, reviews, discount codes ──
```

**Adapter boundary (must-hold):** all Razorpay calls live in `lib/payments/razorpay`; all Shiprocket calls in `lib/shipping/shiprocket`. Never scatter provider-specific calls through the codebase; never let data live only in a provider's dashboard. Our DB is the source of truth → switching provider later = rewrite one adapter, not the store.

**Trust boundary:** card data → Razorpay only. Webhook is the **only** thing that marks an order paid (idempotent; handles duplicate/late webhooks). Secrets server-side only, read from `.env.local` by name.

**Done when:** every choice has a one-line "because," and you can trace click → server → DB → back. ✔
