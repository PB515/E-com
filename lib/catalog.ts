/**
 * PLACEHOLDER catalog — seeds the storefront so layout renders real-shaped.
 * Replaced by Supabase reads in Phase 3/4 (doc 06). Names, prices, motifs,
 * stories, and images are representative placeholders — swap for real SKUs,
 * photos, and prices before launch. Prices are GST-inclusive (HSN 7117 / 12%),
 * within the doc-02 bands. Heritage text describes the motif tradition (the
 * "Wearable Heritage" killer feature), not claims about specific provenance.
 */

export type CategorySlug =
  | "ear-cuffs"
  | "earrings"
  | "bracelets"
  | "hasli"
  | "pendants";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  intro: string;
}

export const CATEGORIES: Category[] = [
  { slug: "hasli", name: "Hasli", blurb: "Statement neckpieces", intro: "Rigid silver-tone neckpieces that sit at the collarbone. The piece an outfit is built around." },
  { slug: "earrings", name: "Earrings", blurb: "Jhumkas, chandbalis, studs", intro: "From temple-bell jhumkas to crescent chandbalis. The everyday and the occasion, in oxidised silver tone." },
  { slug: "ear-cuffs", name: "Ear Cuffs", blurb: "Single and chain-linked", intro: "No piercing needed. A modern way to wear a traditional finish, single or chain-linked." },
  { slug: "bracelets", name: "Bracelets", blurb: "Kadas and cuffs", intro: "Engraved kadas and adjustable cuffs. Weight and detail you can feel on the wrist." },
  { slug: "pendants", name: "Pendants", blurb: "Deity and coin motifs", intro: "Small pieces that carry a motif close. Deity and antique-coin reliefs on a fine chain." },
];

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  priceInr: number; // placeholder, GST-inclusive
  motif: string;
  region: string;
  occasion: string;
  story: string; // 2-3 sentences, the Wearable Heritage block
  material: string;
  size: string;
  care: string;
  images: number; // gallery image count (placeholders for now)
  stock: number; // 0 = out of stock
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    slug: "engraved-hasli-choker",
    name: "Engraved Hasli Choker",
    category: "hasli",
    priceInr: 1899,
    motif: "Paisley",
    region: "Rajasthan",
    occasion: "Weddings and festive wear",
    story:
      "The hasli is the oldest form of Indian neck ornament, a rigid band worn close to the throat. This one carries the paisley, a motif read across Rajasthan as a sign of life and abundance. It is the piece an outfit is built around.",
    material: "German silver, oxidised antique finish",
    size: "Inner width approx. 12 cm, adjustable rear clasp",
    care: "Keep dry. Wipe with a soft cloth. Store in a pouch away from moisture.",
    images: 3,
    stock: 6,
    featured: true,
  },
  {
    slug: "beaded-hasli-set",
    name: "Beaded Hasli Set",
    category: "hasli",
    priceInr: 1499,
    motif: "Ghungroo bead",
    region: "Gujarat",
    occasion: "Festive and ethnic wear",
    story:
      "A hasli paired with matching drops, edged in small ghungroo beads. The beadwork echoes the anklets of folk dance, where sound is part of the ornament. Made to be the centre of a festive look.",
    material: "German silver, oxidised finish, with beads",
    size: "Choker inner width approx. 12 cm; drops 3 cm",
    care: "Keep dry. Wipe gently. Avoid perfume contact on the beads.",
    images: 2,
    stock: 4,
  },
  {
    slug: "oxidised-jhumka",
    name: "Oxidised Jhumka",
    category: "earrings",
    priceInr: 749,
    motif: "Temple bell",
    region: "South India",
    occasion: "Festivals and weddings",
    story:
      "The jhumka takes its dome shape from the temple bells of the south. Worn for generations at weddings and festival nights, the small beads along the rim give it a soft movement and chime. A piece that belongs to celebration.",
    material: "German silver, oxidised antique finish",
    size: "Dome 2.2 cm, total drop 4 cm; post and back",
    care: "Keep dry. Wipe with a soft cloth after wear.",
    images: 3,
    stock: 12,
    featured: true,
  },
  {
    slug: "chandbali",
    name: "Chandbali",
    category: "earrings",
    priceInr: 829,
    motif: "Crescent moon",
    region: "Hyderabad",
    occasion: "Occasion and bridal wear",
    story:
      "Chandbali means moon-shaped. The crescent form travelled with the courts of Hyderabad and became a bridal favourite across India. The tiered crescent catches the light at every angle.",
    material: "German silver, oxidised finish",
    size: "Width 3.2 cm, total drop 5 cm",
    care: "Keep dry. Store flat in a pouch.",
    images: 2,
    stock: 8,
    featured: true,
  },
  {
    slug: "mirror-work-studs",
    name: "Mirror-Work Studs",
    category: "earrings",
    priceInr: 399,
    motif: "Sheesha mirror",
    region: "Kutch",
    occasion: "Everyday and casual ethnic",
    story:
      "Sheesha, or mirror-work, comes from the embroidery of Kutch, where small mirrors are stitched to catch light and ward off the evil eye. Set into a silver-tone frame, it becomes an everyday stud.",
    material: "German silver frame with mirror inlay",
    size: "Diameter 1.2 cm; post and back",
    care: "Keep dry. Avoid scratching the mirror face.",
    images: 2,
    stock: 20,
  },
  {
    slug: "single-oxidised-cuff",
    name: "Single Oxidised Ear Cuff",
    category: "ear-cuffs",
    priceInr: 449,
    motif: "Filigree",
    region: "Odisha",
    occasion: "Everyday and layering",
    story:
      "Filigree, the craft of twisting fine silver wire, has a long home in the workshops of Odisha. This cuff carries that lacework in a form that needs no piercing, clipped to the ear's edge.",
    material: "German silver, oxidised finish",
    size: "Adjustable, fits most; single piece",
    care: "Reshape gently by hand if needed. Keep dry.",
    images: 2,
    stock: 15,
  },
  {
    slug: "chain-linked-ear-cuff",
    name: "Chain-Linked Ear Cuff",
    category: "ear-cuffs",
    priceInr: 549,
    motif: "Filigree",
    region: "Kutch",
    occasion: "Occasion and statement wear",
    story:
      "A cuff joined to a stud by a draping chain, so the ornament follows the curve of the ear. It reads as one continuous piece of silverwork, traditional in finish, modern in how it is worn.",
    material: "German silver, oxidised finish; one ear",
    size: "Adjustable cuff; chain drop 4 cm",
    care: "Keep the chain untangled in a pouch. Keep dry.",
    images: 2,
    stock: 9,
    featured: true,
  },
  {
    slug: "oxidised-kada",
    name: "Oxidised Kada",
    category: "bracelets",
    priceInr: 899,
    motif: "Engraved band",
    region: "Rajasthan",
    occasion: "Festive and ethnic wear",
    story:
      "The kada is a broad, solid bangle worn as a single statement. The engraved band running its width is the work of Rajasthani hand-chasing, where the pattern is cut into the metal by hand. Weight you feel when you wear it.",
    material: "German silver, oxidised antique finish",
    size: "Inner diameter 6.4 cm (size 2-6); openable",
    care: "Keep dry. Wipe the engraving with a soft brush.",
    images: 2,
    stock: 7,
    featured: true,
  },
  {
    slug: "adjustable-cuff",
    name: "Adjustable Cuff",
    category: "bracelets",
    priceInr: 649,
    motif: "Open terminal",
    region: "Himachal",
    occasion: "Everyday and layering",
    story:
      "An open cuff with shaped terminals, a form worn in the hill regions where bracelets are passed down rather than clasped. The opening lets one size sit on many wrists.",
    material: "German silver, oxidised finish",
    size: "Open cuff, adjustable; fits most",
    care: "Open and close gently along the existing curve.",
    images: 2,
    stock: 11,
  },
  {
    slug: "deity-motif-pendant",
    name: "Deity Pendant",
    category: "pendants",
    priceInr: 699,
    motif: "Deity relief",
    region: "Maharashtra",
    occasion: "Daily and devotional wear",
    story:
      "A small relief pendant of the kind carried in Maharashtra as a daily token of faith. The figure is raised from the metal so its detail holds even as the piece is worn close every day.",
    material: "German silver, oxidised finish; on a chain",
    size: "Pendant 2.4 cm; chain 45 cm",
    care: "Keep dry. The chain detaches for cleaning.",
    images: 2,
    stock: 14,
    featured: true,
  },
  {
    slug: "coin-pendant",
    name: "Coin Pendant",
    category: "pendants",
    priceInr: 549,
    motif: "Antique coin",
    region: "Tamil Nadu",
    occasion: "Everyday layering",
    story:
      "The kasu, or coin, is a recurring motif of the south, where strings of coins mark prosperity. Here a single embossed coin hangs from a fine chain, an everyday piece with an old reference.",
    material: "German silver, oxidised finish; on a chain",
    size: "Coin 2 cm; chain 45 cm",
    care: "Keep dry. Wipe with a soft cloth.",
    images: 2,
    stock: 18,
  },
];

// Derived views
export const FEATURED: Product[] = PRODUCTS.filter((p) => p.featured);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function relatedProducts(product: Product, n = 3): Product[] {
  const sameCat = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = PRODUCTS.filter((p) => p.category !== product.category);
  return [...sameCat, ...others].slice(0, n);
}

export function formatInr(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}
