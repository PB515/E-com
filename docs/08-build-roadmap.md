# 08 — Build Roadmap (phases sequenced for safety)

*Bugadi. Control doc (living). Static shape first, then wire data into one proven flow. Because Bugadi has **auth + payments**, the app/security-first order layers on (see app-03). Branch per phase, merge when green.*

> Order phases so each stands on solid ground. Per phase: every acceptance line is **checked**, not "looks about right."

---

## PHASE 0 — Scaffold
**Goal:** repo + Next.js + Tailwind + design tokens as CSS variables + empty routes (from 03b) + skills copied in; deploys blank to Vercel.
**Acceptance:**
- [ ] Next.js (TS) app runs; dev server in its OWN terminal.
- [ ] `app/globals.css` holds the doc-04 tokens; **no hardcoded hex** anywhere.
- [ ] Empty routes exist for every 03b page (storefront + `/admin/*`).
- [ ] `.claude/skills/` copied in (frontend-design + motion). `.env.local` gitignored.
- [ ] Blank deploy succeeds on Vercel; prod build (`npm run build`) passes locally.
**Out of scope:** any content, any data.

## PHASE 1 — Homepage (static)
**Goal:** the main shape — hero, category grid, featured, heritage strip, trust strip, newsletter band, footer (per 03b).
**Acceptance:**
- [ ] Matches 03b section order + doc-04 vibe/tokens; renders at 360px.
- [ ] Nav (desktop + mobile hamburger) + footer links present (can point to empty routes).
- [ ] Motion = named pieces only; honors `prefers-reduced-motion`; no console errors.
**Out of scope:** real product data, cart logic.

## PHASE 2 — Secondary pages (static) + global states
**Goal:** category, PDP (with Heritage Story block), cart, checkout shell, Our Roots, shipping/returns/privacy/terms/contact — all static; global 404/empty/error.
**Acceptance:**
- [ ] Every 03b storefront page exists, static, on-brand, 360px-clean.
- [ ] PDP shows the Heritage Story block (killer feature) + gallery + sticky Add-to-Cart (visual).
- [ ] 404 / empty / error states exist. No console errors.
**Out of scope:** real DB reads, payment, admin auth.

## PHASE 3 — Killer feature + catalog front-end (data-shaped, seeded)
**Goal:** wire the catalog from seed data so categories/PDPs render real-shaped; cart works client-side.
**Acceptance:**
- [ ] Seed data loaded (representative SKUs per 06b; HSN 7117 / rate 12% on each).
- [ ] Category → PDP → Add to Cart → Cart flow works (client cart).
- [ ] Heritage Story renders from product fields; out-of-stock state works.
**Out of scope:** checkout payment, GST persistence, admin.

## PHASE 4 — Data wiring (the rail becomes real)  ⟶ security-first (see app-03)
**Goal:** make the flows real — Supabase + RLS, admin auth, checkout → place-of-supply GST → Razorpay TEST → idempotent webhook → order/invoice (snapshot) → Shiprocket (test) → email.
**Acceptance (build in app-03 order: auth → RLS → PROVE denial → then features):**
- [ ] Admin auth works; **cross-user/logged-out denial PROVEN** before any admin feature ships.
- [ ] Checkout computes CGST+SGST vs IGST by place-of-supply; writes the **tax snapshot** to order + invoice.
- [ ] Razorpay test checkout + COD; **webhook is the only thing that marks paid**, and is **idempotent**.
- [ ] Order confirmation + Resend email; Shiprocket test order created (adapter boundary respected).
- [ ] Tax settings (GSTIN/state/rate) admin-editable; rate change affects FUTURE invoices only.
- [ ] Newsletter + returns forms persist with honeypot + server validation + rate limit.
**Out of scope:** real keys/money (test mode), customer logins, polish.

## PHASE 5 — Polish
**Goal:** responsive 360px, real empty/loading/error states everywhere, **runtime fallbacks** (payment/shiprocket/feed — doc 10), SEO (title/meta/OG/schema), a11y (alt/focus/contrast/keyboard), performance (image sizes), analytics events wired (doc 11), privacy page real.
**Acceptance:**
- [ ] doc-10 QA gate passes on every page; doc-11 events fire; WCAG AA contrast verified.
- [ ] No endless spinners — every live fetch has loading-timeout/empty/failed states.
- [ ] `npm run build` passes locally.

## LAUNCH — see SOP Step 7 / Playbook PART 5
Deploy mechanics → real content + **real product photos/prices/SKUs** → CA verifies sample invoices (intra + inter state) → privacy matches analytics → live smoke test (place a test order on the deployed URL) → soft launch, then full launch once GSTIN + compliance done.

---

**Per-phase ritual (every phase):** Open → Aim (plan first, no code) → Build (small chunks) → Review (agent self-review vs 02 + 04) → QA (doc 10) → Save (commit on phase branch) → Record (Build Log + this status + resume note) → Close.
