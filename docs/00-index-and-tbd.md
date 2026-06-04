# 00 — Doc Index + Reconciliation, TBDs & Sign-off

*Bugadi e-commerce build. Generated at Step 3 (doc-gen-master) from four inputs: Playbook v4 (structure) · Deep Research report (strategy) · Business Brief (substance/voice) · Billing & GST module (the tax/payments rail). Commerce in **test mode**.*

---

## The doc set

```
PLANNING (frozen after sign-off)              CONTROL (touched every session)
  docs/01-user-flow-map.md                      CLAUDE.md            (07 Context Anchor, repo root)
  docs/02-prd.md                                docs/08-build-roadmap.md
  docs/03-component-inventory.md                docs/09-build-log.md
  docs/03b-site-map-and-page-layouts.md ⟵APPROVE docs/10-qa-checkpoint-protocol.md
  docs/04-design-system.md                      docs/11-analytics-events.md
  docs/05-tech-stack-architecture.md
  docs/06-database-schema.md                   APP (authenticated — PART 7)
  docs/06b-image-asset-plan.md                  docs/app-01-app-prd.md
                                                docs/app-02-data-model-security.md
                                                docs/app-03-app-build-roadmap.md
```

## Reconciliation (the four inputs) — CLEAN

Per the kickoff: research **validates** the Brief (heritage positioning, price bands, product-page UX) — no contradictions. **GST settled:** HSN **7117**, rate **12% (CA-confirmed)**, configured as the **admin-editable default**, **snapshotted onto each invoice**. No conflicts left to resolve before generation.

## Internal-consistency check (the Step-3 GATE)

- ✔ Schema (06) has a home for every field the flows (01) write — checkout → orders/order_items/customers/addresses/invoices; newsletter → subscribers; returns → return_requests/credit_notes; admin → products/tax_settings.
- ✔ Killer feature (02 "Wearable Heritage") appears in flows (01 Flow 1 step 3 + Flow 4) and on the PDP (03b).
- ✔ 03b's page list matches the flows and is what 06b counts from (instance-level: ~24 product image files, 5 category cards, etc.).
- ✔ PRD has Conversion Strategy + Form-Security; doc 04 has a Motion block; doc 10 has runtime-fallback + reduced-motion; doc 11 states the analytics choice (cookieless).
- ✔ App: App PRD + Data-Model-&-Security (RLS) + security-first roadmap + denial gate present.

## TBD / unknowns (nothing invented — per the no-fabrication rule)

1. **Real SKUs, product photos, and final prices** — seeded with representative placeholders; **swap before launch** (Brief).
2. **GSTIN** — obtained before *truly* live; build proves the flow without it (`tax_settings.gstin` nullable).
3. **Logo** — interim until commissioned vector (not AI raster).
4. **Testimonials/reviews** — none in v1 (don't fabricate); schema omits AggregateRating until real.
5. **Razorpay + Shiprocket test keys** — founder provides in `.env.local` (agent never holds them).
6. **Exact hex/font values** — set in Phase 0 from doc 04's tokens via `frontend-design`, contrast-verified at launch.

## Founder-decision defaults adopted from the Brief (⟶ CONFIRM before full launch)

The Brief marked these `⟶ your call` and drafted defaults; adopted as-is per your "go" instruction — **confirm or change**:
- **Audience:** Indian women ~18–40, ethnic/fusion, mobile-first, festive/gifting.
- **Voice:** warm and rooted — poetic about tradition, plain about quality/fit/delivery.
- **Price bands:** ear cuffs/earrings ₹250–₹900 · bracelets ₹300–₹1,200 · pendants ₹300–₹1,000 · hasli ₹800–₹2,500.
- **Returns:** 7-day damaged/wrong; credit note reverses GST within the FY.
- **No-List & primary goal:** as in doc 02.

## ⚠️ Legally sensitive — human review before full launch
GST rate/HSN/invoice format/place-of-supply split → **CA verifies** one intra-state + one inter-state sample invoice · privacy policy real + matches deployed analytics · returns/credit-note wording.

---

## Next steps (SOP)
1. **Step 3b — APPROVE `docs/03b`** (site structure + page list + section order) before images/code.
2. **Step 4 — Produce images** (06b → `image-prompt-gen.md`; product shots are real photography).
3. **Step 5 — Setup** (Supabase Mumbai / Razorpay test / Shiprocket / Resend accounts + `.env.local`; copy skills in).
4. **Step 6 — Build** Phase 0→5, security-first at Phase 4 (app-03).
