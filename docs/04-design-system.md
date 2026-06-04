# 04 — Design System & Vibe

*Bugadi. Frozen planning doc. Lead with the vibe, then lock it into tokens the AI can't misread. **All colours are tokens — no hardcoded hex** for the rest of the build.*

> Status: **FROZEN** after sign-off. Tokens are generated as CSS variables in Phase 0; hardcoded hex is forbidden thereafter. *(Reconciliation rule: if the framework stores tokens differently than assumed, update this doc to match reality and log it — don't fight reality.)*

---

## VIBE (one line)

**Rooted and considered — antique-silver heritage, warm and honest, product photography front and centre.** Not luxury-aloof, not bargain-shouty. *(From the Brief's voice: warm and rooted — a little poetic about tradition, plain and honest about quality, fit, and delivery.)*

**REFERENCES** *(directional — final tokens below are authoritative):* the oxidised/antique-silver aesthetic — deep, earthy backgrounds, traditional motif accents, large clean product imagery. Mobile-first.

---

## COLOR (oxidised / antique-silver palette — tokens)

```
--color-bg            deep earthy charcoal (oxidised-dark) — primary background
--color-surface       slightly lifted warm-charcoal — cards/surfaces
--color-ink           warm off-white — primary text on dark
--color-ink-muted     muted silver-grey — secondary text
--color-primary       antique silver — primary CTAs / links / key accents
--color-primary-ink   dark ink for text ON the silver CTA (contrast-safe)
--color-accent        warm gold/brass — used SPARINGLY (festive / highlights)
--color-success       muted green
--color-warning       amber
--color-error         clear red
--color-border        low-contrast warm divider
```
> Exact hex values are chosen in Phase 0 and written as CSS variables. **Hard rule:** the `frontend-design` skill is steered toward THIS brand (oxidised heritage), never its bold default — and **WCAG AA contrast is verified at launch** (silver-on-dark and gold accents are the at-risk pairs; check ink/primary-ink against their backgrounds).

A light-surface variant may be used for product galleries so jewellery reads clearly (photography front and centre) — still drawn from the same tokens.

## TYPE

```
HEADINGS  a characterful serif/display with heritage feel (e.g. a refined serif) —
          sizes on a scale: 40/32/24/20
BODY      a clean, highly legible humanist sans — 16px base, line-height 1.6
NUMERALS  prices/quantities in the body sans (tabular where aligned)
```
*(Final font choices set in Phase 0 via the `frontend-design` skill, steered to the vibe. Self-host or use a licensed/Google font; verify license.)*

## SPACING (scale only — no off-scale values)

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`

## RADIUS

`sm 4px · md 8px · lg 16px` (one set; cards/buttons consistent)

## SHADOWS

`shadow-sm` (cards) · `shadow-md` (sticky add-to-cart bar / modals) — 2 only, used consistently.

## ASSETS

Logo (vector/commissioned — **not** AI raster) · brand/product images per doc **06b**. Fixed brand assets in `/public`; product images served via the framework's optimized image component (`next/image`).

---

## MOTION (v4 — named pieces only)

**Motion vibe:** calm and rooted — understated, never flashy. The brand is warm/considered, so motion is restrained (decoration is off-brand).

**Named pieces this site uses:**
- **reveal** (the workhorse) — product cards, category grid, and Our-Roots vignettes fade/slide up on scroll, **once**.
- **pop-in** — hero brand line + primary CTA land into place on home load.
- **bounce** — at most once on the hero/key motif; not on every page.

**Hard rules (separate polished from amateur):**
- Animate **transform/opacity only** (never width/height/margin — they jank and shift layout).
- Entrances **fire once** (no re-animate on scroll-back).
- **Honor `prefers-reduced-motion`** — with it on, the page is fully static and readable.
- Motion is executed via the **motion layer** (Framer Motion) + the `frontend-design` skill; because it's JS-driven, content must render even if the script is slow/blocked (see doc 10).

**Done when:** a stranger could read the vibe line and describe how the site feels. ✔
