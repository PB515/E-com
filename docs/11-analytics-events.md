# 11 — Analytics & Events

*Bugadi. Control doc (living). Makes measurement a first-class spec, not a Phase-5 scramble. **Decide events here early** so components are built with the hooks in place. Instrument BEFORE launch — you can't measure a launch retroactively.*

---

## ANALYTICS TOOL — the choice (v4)

**Cookieless baseline (Vercel Analytics / Plausible).** *Why for Bugadi:* mobile-first Indian consumers, a clean **DPDP** story with **no consent banner**, and it counts everyone. The store's key questions at launch (does the funnel convert? which categories/products get traffic?) are answerable with pageviews + custom events.

- **Not GA4 in v1** — GA4's deep funnels/segments aren't worth the cookie banner + consent gating + cross-border data transfer at this stage. *If* GA4 is added later for deeper funnel/acquisition analysis, it **MUST fire only after consent** and the **privacy policy MUST match** what's deployed (a launch gate). Expect cookieless and GA4 dashboards to disagree (cookieless counts everyone; GA4 only consenting users).

---

## URL STRUCTURE (clean, stable — don't let the agent improvise slugs)

```
/                       /shop                 /category/[slug]   (ear-cuffs|earrings|bracelets|hasli|pendants)
/product/[slug]         /cart                 /checkout          /order/[id]
/our-roots  /returns  /shipping  /privacy  /terms  /contact
/admin/*  (noindex — not in sitemap, not indexed)
```

## META PER PAGE (required on every public page)

```
Home        title+desc → brand + heritage promise; OG: home/og-default.jpg
Category    title = "<Category> — Oxidised Jewellery | Bugadi"; desc per category
Product     title = "<Product name> | Bugadi"; desc = short heritage + material; OG = product primary image
Our Roots / content pages  → own title + desc
```
**Rendered <title> check (launch gate):** the site/brand name appears **once**, not doubled — check the real output, not the template.

## STRUCTURED DATA (schema)

```
Product pages   → Product + Offer schema (name, image, price INR, availability, brand "Bugadi")
Organization    → on home (name, logo, contact) — single-brand store
BreadcrumbList  → category → product
```
*(Real values only — no invented reviews/ratings; AggregateRating omitted until real reviews exist.)*

## KEY EVENTS TO TRACK (the funnel — this is what proves the store works)

```
product_viewed            (PDP open)                — top of funnel
add_to_cart               (the primary-CTA moment)  — killer_feature_started equivalent
checkout_started          (checkout page reached)
place_of_supply_computed  (tax line shown)          — friction checkpoint
purchase_completed        (webhook-confirmed paid / COD placed) — the conversion moment
cod_selected              (payment-method split)
newsletter_signup         (secondary CTA)
return_requested
[drop-off] cart_abandoned / checkout_abandoned (from Flow Map drop-off points)
```

**Why events > pageviews:** pageviews tell you traffic; **add_to_cart → purchase_completed** tells you whether the funnel converts — the single most valuable number. Wire these in Phase 5, but the components built in Phases 3–4 must already expose the hooks (don't retrofit).

**Instrument before launch (v4):** turn analytics on and verify events arrive on the **deployed** URL before promoting — the first weeks' data is gone if tracking isn't already live.

**Done when:** every conversion moment in the Flow Map (01) has a named event, and every public page has a title/description/schema plan. ✔
