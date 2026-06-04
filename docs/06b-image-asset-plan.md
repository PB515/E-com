# 06b — Image & Asset Plan (instance-level, counted FROM 03b)

*Bugadi. Frozen planning doc. Images are **trust infrastructure**, not decoration — each must do a job text can't. Count by INSTANCE (one row per FILE), expanded from 03b's page list. Generated/sourced BEFORE coding.*

> Status: **FROZEN** after 03b sign-off (this is counted from 03b's page list). Compress every image (Squoosh/TinyPNG) before adding; serve via `next/image`.

---

## Hard rules (carried from the Playbook)

- **Real beats stock on trust slots.** Product photos must be the **real pieces** — for a jewellery store the product shot IS the trust asset. Placeholder/representative images are used at build time and **swapped for real photography before launch** (Brief: never fabricate; swap in real products/photos/prices before going live).
- **Never present an AI-generated person as a real customer/testimonial.** (No fake testimonial faces — v1 has no testimonials; see TBD.)
- **Logo:** vector / commissioned — **not** AI raster.
- **Never** use random web images (copyright is real liability). Own or properly-licensed only.
- **Per-page image-depth is a deliberate choice** (unique/shared/icon/none). Content/legal pages → none.

---

## The decision, per surface (from 03b)

| Need | Use | Where |
|---|---|---|
| Show the actual product (the whole sell) | **Real product photos** (multi-angle, zoomable) | PDP gallery, product cards, home featured |
| Identify a category fast | **Icons / one representative shot** | Category cards (home + nav) |
| Heritage / "this is real tradition" | **Real photos** (motif close-ups, craft) | Our Roots, heritage strip |
| Brand | **Vector logo** | Header, footer, OG |
| Nothing text doesn't do | **No image** | Cart, checkout, policy/legal, contact |

---

## Asset table (one row per FILE — instance-level)

```
FILE (public/images/...)              TYPE          DEPTH   SOURCE            STATUS   ALT
logo/bugadi-logo.svg                  vector        unique  commissioned      interim  "Bugadi"
home/hero.jpg                         real photo    unique  own/shoot         placeholder "oxidised jewellery hero"
home/og-default.jpg                   image         unique  own/made          needed   (OG share image)
category-cards/ear-cuffs.jpg          real photo    shared  own/shoot         placeholder "ear cuffs"
category-cards/earrings.jpg           real photo    shared  own/shoot         placeholder "earrings"
category-cards/bracelets.jpg          real photo    shared  own/shoot         placeholder "bracelets"
category-cards/hasli.jpg              real photo    shared  own/shoot         placeholder "hasli"
category-cards/pendants.jpg           real photo    shared  own/shoot         placeholder "pendants"
roots/craft-1.jpg .. craft-3.jpg      real photo    unique  own/shoot         placeholder "the craft / motif"  (×3)
icons/*                               icon set      n/a     licensed icon set  have     n/a (cart, shipping, COD, secure)
```

### Product images — counted per SKU (the instance expansion)

Each seeded SKU gets **1 primary + up to 2 alternate** angles. Seeded representative set (placeholders — replace with real SKUs/photos before launch):

```
PRODUCT (slug)                         FILES (product-images/<slug>/)        TYPE        SOURCE
ear-cuffs:
  single-oxidised-cuff                 1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
  chain-linked-ear-cuff                1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
earrings:
  oxidised-jhumka                      1.jpg, 2.jpg, 3.jpg                   real photo  own/shoot (placeholder)
  chandbali                            1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
  mirror-work-studs                    1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
bracelets:
  oxidised-kada                        1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
  adjustable-cuff                      1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
hasli:
  engraved-hasli-choker                1.jpg, 2.jpg, 3.jpg                   real photo  own/shoot (placeholder)
  beaded-hasli-set                     1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
pendants:
  deity-motif-pendant                  1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
  coin-pendant                         1.jpg, 2.jpg                          real photo  own/shoot (placeholder)
```
**Instance count:** ~11 seeded SKUs × ~2 images ≈ **24 product image files** + 1 hero + 1 OG + 5 category cards + 3 roots + logo. *(Each real SKU added later expands this list — a "product image" is per-file, not one category row.)*

---

## How images are produced (Step 4)

Run `prompts/image-prompt-gen.md` against THIS table + doc 04 to emit one **filename-labeled**, aspect-locked prompt per file. For Bugadi, product/hero/category/roots slots are **real photography** of the actual pieces (the trust asset) — AI generation is **not** appropriate for product shots a customer will buy from. Use AI only for the OG/brand-art slot if needed. Save each file under its stated path — no rename step. Lock aspect ratios (product square 1:1; hero wide; category cards 4:5).

**Done when:** every image FILE implied by 03b's page list has a row with type/depth/source/alt, and nothing decorative survived the "does it do a job?" test. ✔

## TBD / flags
- All product photos are **placeholders** until the real shoot — swap before launch (Brief rule).
- Logo is **interim** until commissioned vector.
- No testimonials in v1 → no testimonial photos (don't fabricate).
