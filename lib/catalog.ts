/**
 * PLACEHOLDER catalog shape — seeds the storefront so layout renders real-shaped.
 * Replaced by Supabase reads in Phase 3/4 (doc 06). Names, prices, motifs, and
 * images here are representative placeholders — swap for real SKUs before launch.
 * Prices are GST-inclusive (HSN 7117 / 12%), within the doc-02 bands.
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
}

export const CATEGORIES: Category[] = [
  { slug: "hasli", name: "Hasli", blurb: "Statement neckpieces" },
  { slug: "earrings", name: "Earrings", blurb: "Jhumkas, chandbalis, studs" },
  { slug: "ear-cuffs", name: "Ear Cuffs", blurb: "Single and chain-linked" },
  { slug: "bracelets", name: "Bracelets", blurb: "Kadas and cuffs" },
  { slug: "pendants", name: "Pendants", blurb: "Deity and coin motifs" },
];

export interface Piece {
  slug: string;
  name: string;
  category: CategorySlug;
  priceInr: number; // placeholder, GST-inclusive
  motif: string;
  region: string;
}

// A considered edit for the home "Featured" rail (placeholders).
export const FEATURED: Piece[] = [
  { slug: "engraved-hasli-choker", name: "Engraved Hasli Choker", category: "hasli", priceInr: 1899, motif: "Paisley", region: "Rajasthan" },
  { slug: "oxidised-jhumka", name: "Oxidised Jhumka", category: "earrings", priceInr: 749, motif: "Temple bell", region: "South India" },
  { slug: "chain-linked-ear-cuff", name: "Chain-Linked Ear Cuff", category: "ear-cuffs", priceInr: 549, motif: "Filigree", region: "Kutch" },
  { slug: "oxidised-kada", name: "Oxidised Kada", category: "bracelets", priceInr: 899, motif: "Engraved band", region: "Rajasthan" },
  { slug: "deity-motif-pendant", name: "Deity Pendant", category: "pendants", priceInr: 699, motif: "Deity", region: "Maharashtra" },
  { slug: "chandbali", name: "Chandbali", category: "earrings", priceInr: 829, motif: "Crescent", region: "Hyderabad" },
];

export function formatInr(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}
