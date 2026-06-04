# Step 4 — Image Generation Prompts (instance-level, filename-labeled)

*Bugadi. Generated from 06b (Image & Asset Plan) + 04 (Design System) + 03b (page list). One prompt per image FILE, aspect locked, FILE: path attached — save each download straight to its path, no rename.*

> **This file does NOT contain images — it contains the prompts.** Generate each, pick the best variant (3–4 per file; tools drift on colour), confirm the aspect ratio BEFORE accepting, save as the `FILE:` path, then compress (Squoosh/TinyPNG) keeping the filename.

---

## ⚠️ Real-photography rule (jewellery store — read first)

The **product, hero, category-card, and roots** images are **trust slots** — at launch they must be **real photographs of the actual pieces** (Playbook: real beats stock, never AI-faked-as-real; Brief: swap in real products/photos before going live). The AI prompts below are valid **build placeholders** so you can vibe-code the layout real-shaped now — but they are tagged **[SWAP BEFORE LAUNCH]** and must be replaced with real photography (or the founder's own shoot) before full launch. The same prompt text doubles as the **art-direction brief** for that real shoot (subject, framing, lighting, background, ratio).
Only **OG/brand-art** and **icons/logo** are not real-photo slots.

---

## COUNT — 34 image files (+ 2 skipped groups)

| Group | Files | Ratio | Real-photo at launch? |
|---|---|---|---|
| `home/` | 2 (hero, og-default) | hero 16:9 · og 1.91:1 | hero ✔ / og ✖ (AI ok) |
| `category-cards/` | 5 | 4:5 | ✔ |
| `roots/` | 3 | 3:2 | ✔ |
| `product-images/` | 24 (~11 SKUs × 2–3 angles) | 1:1 | ✔ |
| **SKIPPED** | logo (vector) · icons (icon set) | — | — |

---

## HOUSE STYLE  *(every prompt below inherits this — one coherent family)*

```
HOUSE STYLE — Bugadi "oxidised heritage":
Aesthetic: traditional Indian oxidised / antique German-silver jewellery, styled to wear
today. Rooted, considered, warm and honest — heritage, not bargain-bin; product front and
centre. NOT bright commercial white-studio sterility, NOT neon, NOT plastic-shiny, NOT busy.
Palette (indicative — exact tokens finalize in Phase 0; target these):
  background  deep warm charcoal #1E1B18 / lifted surface #2A2622
  metal/subject  antique silver with oxidised blackened recesses (matte, not chrome)
  text-tone (do not render text) warm off-white #F2EDE4 / muted silver-grey #B8AFA2
  accent  warm brass/gold #B08D57 — used SPARINGLY
Lighting: soft, directional, slightly warm key light; gentle falloff; highlights catch the
raised silver, shadows sit in the oxidised recesses to show depth and craft. Subtle, moody,
editorial — never flat or harsh.
Surfaces/props: dark stone, raw silk, aged wood, terracotta, marigold — restrained, never
cluttered; one or two heritage props max. Mobile-first, clean negative space.
Hard rules for EVERY image: NO text, NO logos, NO watermarks inside the image (text added in
code). No Western minimalist look that strips the heritage. Photo-real documentary style for
products/places. Muted, warm, desaturated — re-add the hex above if a variant drifts cool/bright.
```

---

## GROUP: `home/`

```
FILE: home/hero.jpg              [SWAP BEFORE LAUNCH — real photography of real pieces]
RATIO: 16:9  — wide landscape, do NOT output square or vertical, do NOT crop
PROMPT:
[HOUSE STYLE above] Wide 16:9 hero photograph for a heritage oxidised-jewellery storefront.
A considered editorial still life: an arrangement of oxidised German-silver Indian pieces — a
statement jhumka and a hasli choker resting on dark raw silk with a single marigold and soft
warm light raking across, highlights on the raised silver, deep shadows in the oxidised
recesses. Generous empty space on the left third for headline text to be added in code. Moody,
warm, desaturated, premium-but-rooted. No text, no logo, no watermark.
Wide 16:9 landscape — do NOT output square or vertical, do NOT crop.
```
```
FILE: home/og-default.jpg        [AI ok — social share card]
RATIO: 1.91:1 (1200×630) — landscape social card, not square, do NOT crop
PROMPT:
[HOUSE STYLE above] A 1.91:1 (1200×630) social-share still life: a small, elegant grouping of
oxidised silver Indian jewellery on deep warm charcoal with one brass-gold accent prop, soft
warm light, lots of clean negative space (composition centred so nothing important sits at the
edges where it could be cropped by social previews). Moody, warm, desaturated. No text, no
logo, no watermark.
Landscape 1.91:1, 1200×630 — not square, do NOT crop.
```

---

## GROUP: `category-cards/`  *(4:5 portrait · one representative piece per category)*

```
FILE: category-cards/ear-cuffs.jpg        [SWAP BEFORE LAUNCH]
RATIO: 4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop
PROMPT:
[HOUSE STYLE above] A 4:5 portrait product photograph representing the EAR CUFFS category: a
single oxidised German-silver ear cuff on a dark stone surface, soft warm directional light,
oxidised recesses dark and raised filigree catching the light, clean negative space below.
Documentary, moody, warm, desaturated. No text, no logo, no watermark.
4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop.
```
```
FILE: category-cards/earrings.jpg         [SWAP BEFORE LAUNCH]
RATIO: 4:5 portrait — taller than wide, do NOT crop
PROMPT:
[HOUSE STYLE above] A 4:5 portrait shot representing the EARRINGS category: an oxidised silver
jhumka with tiny bells, hanging or laid on raw silk, warm raking light catching the dome and
beads, deep heritage mood, clean space. Documentary, warm, desaturated. No text/logo/watermark.
4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop.
```
```
FILE: category-cards/bracelets.jpg        [SWAP BEFORE LAUNCH]
RATIO: 4:5 portrait — taller than wide, do NOT crop
PROMPT:
[HOUSE STYLE above] A 4:5 portrait representing the BRACELETS category: an oxidised silver kada
(broad engraved bangle) standing on edge on aged wood, warm light tracing the engraved motifs,
oxidised detail in the recesses, moody negative space. Documentary, warm, desaturated.
No text/logo/watermark.
4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop.
```
```
FILE: category-cards/hasli.jpg            [SWAP BEFORE LAUNCH]
RATIO: 4:5 portrait — taller than wide, do NOT crop
PROMPT:
[HOUSE STYLE above] A 4:5 portrait representing the HASLI category: a rigid oxidised silver
hasli neckpiece (statement choker) curved on dark raw silk, strong warm key light showing the
engraved surface and oxidised depth, premium heritage feel, clean space. Documentary, warm,
desaturated. No text/logo/watermark.
4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop.
```
```
FILE: category-cards/pendants.jpg         [SWAP BEFORE LAUNCH]
RATIO: 4:5 portrait — taller than wide, do NOT crop
PROMPT:
[HOUSE STYLE above] A 4:5 portrait representing the PENDANTS category: a single oxidised silver
deity/coin-motif pendant on a fine chain coiled on dark stone, warm directional light catching
the embossed motif, oxidised recesses dark, restrained and moody. Documentary, warm, desaturated.
No text/logo/watermark.
4:5 portrait — taller than wide, do NOT output square or landscape, do NOT crop.
```

---

## GROUP: `roots/`  *(3:2 landscape · the craft / heritage story — Our Roots page)*

```
FILE: roots/craft-1.jpg          [SWAP BEFORE LAUNCH — ideally real craft photography]
RATIO: 3:2 landscape — wider than tall, do NOT output square or vertical, do NOT crop
PROMPT:
[HOUSE STYLE above] A 3:2 documentary photograph evoking the CRAFT behind oxidised jewellery:
artisan hands working a piece of silver jewellery at a worn wooden workbench, simple tools,
warm low light, shallow depth of field on the piece. Honest, human, rooted — not staged or
glossy. Warm, desaturated. No identifiable face needed; focus on hands and the piece. No
text/logo/watermark.
3:2 landscape — wider than tall, do NOT output square or vertical, do NOT crop.
```
```
FILE: roots/craft-2.jpg          [SWAP BEFORE LAUNCH]
RATIO: 3:2 landscape — wider than tall, do NOT crop
PROMPT:
[HOUSE STYLE above] A 3:2 still life evoking MOTIF & TRADITION: a close detail of an oxidised
silver piece showing a traditional motif (paisley/peacock/lotus) beside a marigold and a scrap
of raw silk on dark stone, warm raking light, deep heritage mood. Editorial, warm, desaturated.
No text/logo/watermark.
3:2 landscape — wider than tall, do NOT output square or vertical, do NOT crop.
```
```
FILE: roots/craft-3.jpg          [SWAP BEFORE LAUNCH]
RATIO: 3:2 landscape — wider than tall, do NOT crop
PROMPT:
[HOUSE STYLE above] A 3:2 lifestyle photograph: oxidised silver jewellery worn with ethnic/fusion
clothing — a cropped, tasteful shot of an ear cuff or hasli against a draped dark-toned outfit,
warm natural light, focus on the piece in context, rooted and modern. Documentary, warm,
desaturated. No text/logo/watermark. (If using a person, it must be a real model with consent at
the real-photo swap — AI placeholder here is context-only.)
3:2 landscape — wider than tall, do NOT output square or vertical, do NOT crop.
```

---

## GROUP: `product-images/`  *(1:1 square · placeholder SKUs — real product photos at launch)*

**Per-SKU angle convention** (so multiple files per SKU differ by ANGLE, not concept):
`1.jpg` = primary front, centred on neutral dark surface · `2.jpg` = 3/4 detail / macro of the
oxidised texture · `3.jpg` (where present) = styled-in-context / scale shot.
All 1:1 square; same product across its files; consistent light per SKU. **[SWAP BEFORE LAUNCH]**
RATIO reminder for every block: `1:1 square — equal width and height, do NOT crop to another ratio.`

### ear-cuffs
```
FILE: product-images/single-oxidised-cuff/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — a single oxidised German-silver ear cuff,
front view, centred on deep warm charcoal stone, soft warm key light, oxidised recesses dark,
raised filigree highlighted, clean negative space. Photo-real, warm, desaturated. No text/logo.
1:1 square — equal width and height, do NOT crop.
```
```
FILE: product-images/single-oxidised-cuff/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME single oxidised ear cuff — 3/4 angle close
detail showing the engraved texture and oxidised depth, shallow depth of field, same warm light.
No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/chain-linked-ear-cuff/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver chain-linked ear cuff
(cuff joined by a draping chain), laid front-on on dark stone so the chain curves elegantly,
warm directional light. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/chain-linked-ear-cuff/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square 3/4 detail of the SAME chain-linked ear cuff, focus on the
link/chain junction and oxidised texture, shallow depth of field, same warm light. No text/logo.
1:1 square — do NOT crop.
```

### earrings
```
FILE: product-images/oxidised-jhumka/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — a classic oxidised silver jhumka (domed bell
earring with tiny dangling beads), front view, hanging or upright on dark stone, warm key light
catching the dome and beads, oxidised recesses dark. Photo-real, warm, desaturated. No text/logo.
1:1 square — do NOT crop.
```
```
FILE: product-images/oxidised-jhumka/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME jhumka — close detail of the dome engraving
and bead fringe, shallow depth of field, same warm light. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/oxidised-jhumka/3.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square styled shot of the SAME jhumka resting on raw silk beside a
single marigold for scale and context, warm light, restrained. Photo-real, warm, desaturated.
No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/chandbali/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver chandbali (crescent-moon
shaped earring) front view on dark stone, warm directional light tracing the crescent and
filigree, oxidised depth. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/chandbali/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square 3/4 detail of the SAME chandbali, focus on the crescent
engraving and any bead drops, shallow depth of field. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/mirror-work-studs/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — a pair of oxidised silver mirror-work studs
(small studs set with tiny mirrors), front view together on dark stone, warm light catching the
mirror glints and oxidised frame. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/mirror-work-studs/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of ONE of the SAME mirror-work studs, close detail of
the mirror and oxidised setting, shallow depth of field, same warm light. No text/logo.
1:1 square — do NOT crop.
```

### bracelets
```
FILE: product-images/oxidised-kada/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — a broad oxidised silver kada (engraved rigid
bangle), standing on edge / 3/4 on dark stone so the engraved band is visible, warm key light in
the recesses. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/oxidised-kada/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME kada — close detail of the engraved motif and
oxidised depth, shallow depth of field, same warm light. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/adjustable-cuff/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver adjustable cuff bracelet
(open-ended), front view on dark stone showing the open gap and engraved surface, warm light.
Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/adjustable-cuff/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square 3/4 detail of the SAME adjustable cuff, focus on the terminal
ends and oxidised texture, shallow depth of field. No text/logo. 1:1 square — do NOT crop.
```

### hasli
```
FILE: product-images/engraved-hasli-choker/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — a rigid oxidised silver engraved hasli choker,
curved and centred on dark raw silk, strong warm key light showing the full engraved surface and
oxidised depth, premium heritage feel. Photo-real, warm, desaturated. No text/logo.
1:1 square — do NOT crop.
```
```
FILE: product-images/engraved-hasli-choker/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME hasli — close detail of the central engraved
motif and oxidised recesses, shallow depth of field, same warm light. No text/logo.
1:1 square — do NOT crop.
```
```
FILE: product-images/engraved-hasli-choker/3.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square context shot of the SAME hasli laid against a draped dark-toned
ethnic fabric to suggest how it sits at the collarbone (no face needed), warm light, restrained.
Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/beaded-hasli-set/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver beaded hasli SET (neckpiece
with matching small earrings), arranged together on dark stone, warm key light, oxidised beads
and depth visible. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/beaded-hasli-set/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME beaded hasli set — close detail of the beadwork
and oxidised silver, shallow depth of field, same warm light. No text/logo. 1:1 square — do NOT crop.
```

### pendants
```
FILE: product-images/deity-motif-pendant/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver deity-motif pendant on a fine
chain, pendant front-on and centred on dark stone with the chain softly coiled, warm light catching
the embossed motif, oxidised recesses dark. Photo-real, warm, desaturated. No text/logo.
1:1 square — do NOT crop.
```
```
FILE: product-images/deity-motif-pendant/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square macro of the SAME deity-motif pendant — close detail of the
embossed figure and oxidised depth, shallow depth of field, same warm light. No text/logo.
1:1 square — do NOT crop.
```
```
FILE: product-images/coin-pendant/1.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square product photo — an oxidised silver coin pendant (antique-coin
motif disc) on a fine chain, front-on on dark stone, chain coiled, warm directional light on the
embossed coin face. Photo-real, warm, desaturated. No text/logo. 1:1 square — do NOT crop.
```
```
FILE: product-images/coin-pendant/2.jpg
RATIO: 1:1
PROMPT: [HOUSE STYLE] 1:1 square 3/4 macro of the SAME coin pendant — close detail of the coin
relief and oxidised recesses, shallow depth of field, same warm light. No text/logo.
1:1 square — do NOT crop.
```

---

## SKIPPED  *(no generation prompt — by design)*

- **`logo/bugadi-logo.svg`** — a logo must be **true vector**, commissioned or designed, never AI raster (it scales and must be crisp at every size). Interim placeholder until commissioned.
- **`icons/*`** (cart, shipping, COD, secure-payment, category glyphs) — use a consistent **licensed icon set** (e.g. Lucide/Phosphor), not generated images, so they stay crisp and uniform and carry no copyright risk.

---

## Tool ratio syntax (set per your image tool)

The prompts above state ratios in **plain words** (works for Gemini/Imagen and ChatGPT/DALL·E). If you use **Midjourney**, append the flag instead: `--ar 16:9` (hero), `--ar 191:100` (og), `--ar 4:5` (category), `--ar 3:2` (roots), `--ar 1:1` (product). Aspect ratio is the most-ignored instruction — confirm it on the output before saving.

## Workflow reminder
Generate per group in one sitting (consistency) → 3–4 variants each, pick best palette match (re-add hex if it drifts cool/bright) → confirm ratio → save as the `FILE:` path → compress (Squoosh/TinyPNG), same name → lay each group side-by-side, regenerate any odd one out. The agent wires them via `next/image` with the alt text from 06b — you don't place them by hand.

## GATE (image-prompt-gen)
- ✔ COUNT given (34 files, by group) · ✔ every photo INSTANCE has its own prompt · ✔ every prompt has a FILE: path matching 06b · ✔ one house style throughout · ✔ distinct concept/angle per instance · ✔ ratio loud + repeated · ✔ icons + vector logo SKIPPED with reason.
