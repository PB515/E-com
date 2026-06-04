# PROJECT CONTEXT — read this first  (doc 07 · Context Anchor)

*Bugadi — e-commerce. This file auto-loads every session. Update the "Current status" block at the end of every session.*

## What this is
**Bugadi** — an Indian e-commerce store selling **oxidised (antique-finish) imitation jewellery** in 5 categories (ear cuffs, earrings, bracelets, hasli, pendants). Positioning: **traditional ornament, styled to wear today** — the killer feature is **"Wearable Heritage"** product pages (every SKU carries its motif/region/occasion story). India-only, mobile-first, guest checkout. Has a storefront + an authenticated **admin** (products, orders, tax settings, invoices, returns). **Commerce runs in TEST MODE** (Razorpay test keys; no real money).

## Current status
**Phase 2 DONE (green).** All storefront pages built static with `design-taste-frontend`: category (SSG), **PDP w/ Heritage Story block** (SSG, gallery + buy panel + sticky mobile add-to-bag + related + Product JSON-LD), shop-all, cart (empty state), checkout shell (address + State select + summary, visual), Our Roots, and policy pages (shipping/returns/privacy/terms/contact w/ honeypot forms). Build passes (36 routes), verified live, no console errors, 360px clean. Site is LIVE at https://e-com-tan-ten.vercel.app. **Next: Phase 3** — wire the **client cart** (add-to-bag works, cart line items + subtotal, header badge); branch `phase-3` off main; no DB/payment yet (Phase 4). Reuse `shop/AddToCart`, `lib/catalog`. **Still open (your side):** Step-5 accounts/keys (Supabase Mumbai, Razorpay test, Shiprocket, Resend) for Phase 4. Image slots are placeholders → real photos from `docs/image-prompts.md` before launch. Storefront = taste-skill; admin/checkout-internals do NOT use it.

## Stack
Next.js (App Router, TS) · Tailwind + CSS-variable tokens · Supabase (Postgres+Auth+RLS, **Mumbai/ap-south-1**) · Resend (email) · **Razorpay TEST** (adapter `lib/payments/razorpay`) · **Shiprocket** (adapter `lib/shipping/shiprocket`) · Framer Motion · Vercel · cookieless analytics.

## Conventions (do not violate)
- **Tokens only — no hardcoded hex.** Colours/spacing/radius come from the CSS variables (doc 04).
- **No new dependencies AND no upgrades without asking** (no `npm update`, no version bumps).
- **Secrets in `.env.local` only** — never in code, chat, or a screenshot. Agent refers to keys by name only; never creates accounts or enters keys (human does).
- **Adapter boundary:** all Razorpay calls in `lib/payments/razorpay`; all Shiprocket calls in `lib/shipping/shiprocket`. Never scatter provider calls.
- **Tax:** HSN/rate are **admin-editable data** (default HSN `7117`, rate **12% — CA-confirmed**), **snapshotted onto the order/invoice** at sale; never hard-coded; editing a rate affects future invoices only.
- **Card data never on our server** — Razorpay hosted checkout only. **Webhook is the only thing that marks an order paid** — idempotent.
- **Security-first (app):** auth → RLS/access rules → **prove cross-user / logged-out denial** → then features. Deny by default.
- **Forms:** honeypot + server validation + rate limit (logic in `lib/security.ts`).
- **Git per phase**, branch per phase, merge when green. Stuck = 3 strikes → `git checkout` + fresh session.
- **Frozen doc change** = update doc → commit separately → then build.
- Run `npm run build` (prod build) locally before every push.

## Decisions made (do not revisit)
- 5 categories; guest checkout (no customer logins in v1); single-brand store (**no marketplace TCS**).
- GST 12% / HSN 7117, admin-editable + snapshot; place-of-supply split (registered vs shipping state).
- Returns: 7-day **damaged/wrong only** → credit note reverses GST (same FY).
- India-only; no international, no bespoke, no precious/hallmarked (oxidised only).
- Founder-decision defaults (audience, voice, price bands, returns, primary goal) adopted from the Brief — see docs 02/04; **confirm before full launch.**

## Where things live
- Planning (frozen): `docs/01`–`06b`. Control (living): this file + `docs/08`–`11`. App: `docs/app-01..03`.
- Tokens: `app/globals.css`. Schema: `docs/06`. Tax model + human setup steps: Billing & GST module.
- Adapters: `lib/payments/razorpay`, `lib/shipping/shiprocket`. Webhook: `app/api/webhooks/razorpay`.
