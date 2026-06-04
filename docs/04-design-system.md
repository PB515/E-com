# 04 — Design System & Vibe

*Bugadi. Frozen planning doc. Lead with the vibe, then lock it into tokens the AI can't misread. **All colours are tokens — no hardcoded hex** for the rest of the build.*

> Status: **FROZEN** — **revised 2026-06-04** to record the `design-taste-frontend` (taste-skill) decision on palette + type (logged frozen-doc change; see Build Log). Tokens are CSS variables; hardcoded hex forbidden thereafter. *(Reconciliation rule: if the framework stores tokens differently than assumed, update this doc to match reality and log it.)*

---

## Skill: `design-taste-frontend` (storefront surfaces only)

The **storefront** (home, category, PDP, Our Roots, content) is built with the **taste-skill**. Admin + checkout/cart are dense/multi-step UI — **out of the skill's scope** (its Section 13) — and follow the functional patterns in docs 03/04.

**Design Read (skill §0.B):** *Reading this as a heritage e-commerce storefront for design-conscious Indian festive/gifting shoppers (mobile-first), with a rooted, considered language, leaning toward a **dark editorial commerce** aesthetic — antique/oxidised silver on near-black, a justified heritage serif for display, restrained motion, real product photography as the hero.*

**Dials (skill §1):** `DESIGN_VARIANCE: 7` · `MOTION_INTENSITY: 4` · `VISUAL_DENSITY: 3`. Rationale: distinctive but shoppable (not chaos); brand voice is *calm/rooted* so motion stays restrained (below the skill's premium-consumer 6); airy, considered edit — product-forward, not an endless grid.

**Why we diverged from the skill's defaults (recorded):** the skill **bans** the warm beige/brass/espresso palette and **bans Fraunces** as the two top premium-consumer AI-tells. Our v1 doc reached for exactly those. Corrected below: cool silver-on-near-black (the actual oxidised metal, justified) with brass/gold **dropped**, and a heritage serif that is **not** Fraunces.

---

## VIBE (one line)

**Rooted, considered, dark-editorial — oxidised silver on near-black, the piece is the hero.** Not luxury-aloof, not bargain-shouty, not warm-craft-cliché.

**REFERENCES** *(directional — tokens below are authoritative):* dark editorial commerce; antique/oxidised silver jewellery photographed on deep near-black; one restrained festive accent. Mobile-first.

---

## COLOR (cool oxidised silver on near-black — tokens) · **page theme LOCKED dark**

One accent, locked, used across the whole page (skill §4.2 Color-Consistency Lock). No brass/gold. No pure `#000`/`#fff` (skill §8.B). Indicative hex (finalized + WCAG-AA-verified in Phase 1 by the skill):

```
--color-bg            #0d0e10  near-black, slightly cool (NOT pure black, NOT warm espresso)
--color-surface       #16181b  lifted cool charcoal — cards/surfaces
--color-ink           #ECEEF0  cool off-white — primary text on dark
--color-ink-muted     #9aa0a6  muted cool silver-grey — secondary text
--color-primary       #C8CBD0  antique/oxidised silver — primary CTAs / links (cool, matte, NOT chrome)
--color-primary-ink   #0d0e10  near-black text ON the silver CTA (contrast-safe)
--color-accent        #B23A52  the ONE accent — deep desaturated rose/crimson (festive, <80% sat),
                                used SPARINGLY (sale tags, focus, festive highlights). NOT brass/gold.
--color-success       #5aa57c
--color-warning       #c9a23e
--color-error         #cf5a50
--color-border        #2a2d31  low-contrast cool divider
```
> **At-risk contrast pairs to verify (skill §4.5 / §4.7):** silver `--color-primary` text on `--color-bg`; `--color-ink-muted` on `--color-bg`; accent rose text on dark; `--color-primary-ink` on the silver CTA. Primary CTA = the silver fill with near-black text (high contrast); accent rose is for highlights, not body.
>
> *(Accent is **deep rose/crimson**; a peacock-teal `#1f6f6a` is the noted alternate if you prefer a cooler festive note — one or the other, locked, never both.)*

**Product galleries** may sit on a slightly lifted surface so the jewellery reads, but the **page theme stays dark** (skill §4.11 Theme Lock — no mid-page flip to a light section).

## TYPE  *(heritage serif display + clean sans body)*

```
HEADINGS  a justified HERITAGE SERIF (skill-approved pool, NOT Fraunces / NOT Instrument Serif):
          first choice Cormorant Garamond; alts PP Editorial New, GT Sectra, EB Garamond.
          Display scale 40/32/24/20. Emphasis = italic/bold of the SAME family (skill §4.1),
          never a second family. Audit italic descenders (y/g/j/p/q) → leading-[1.1] + pb-1.
BODY      a clean, highly legible sans (Geist / Outfit / Inter Tight) — 16px base, line-height ~1.6.
          NOT a serif body. One sans family.
NUMERALS  prices/quantities in the body sans, tabular where aligned.
```
*(Wired via `next/font` in Phase 1 — never a `<link>` (skill §3.A). Self-host or Google font; verify license. Serif is justified here on genuine heritage grounds, articulated above — the skill's bar for using a serif at all.)*

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
- Motion is executed via **Motion** (`motion/react`, the lib formerly Framer Motion) under the `design-taste-frontend` skill; because it's JS-driven, content must render even if the script is slow/blocked (see doc 10). At `MOTION_INTENSITY: 4` this means CSS/transform transitions + a light scroll-reveal stagger (skill §5.C) — no scroll-hijack, no marquee-spam, every animation motivated (skill §5).

**Done when:** a stranger could read the vibe line and describe how the site feels. ✔
