/**
 * Categories (static — the 5 are fixed) + the Product type + helpers.
 * PRODUCT DATA now lives in Supabase and is read via `lib/products.ts`
 * (server). Prices are GST-inclusive (HSN 7117 / 12%). Seed data + the schema
 * are in `supabase/migrations/0001_init.sql`.
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

/** One purchasable option of a product (its own stock / price / SKU). */
export interface ProductVariant {
  id: string;
  label: string;
  priceInr: number; // resolved: variant override, else the product price (GST-inclusive)
  stock: number; // 0 = this variant out of stock
  sku?: string;
}

/** Product shape used across the storefront. Source of truth = Supabase. */
export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  priceInr: number; // GST-inclusive
  motif: string;
  region: string;
  occasion: string;
  story: string; // the Wearable Heritage block
  material: string;
  size: string;
  care: string;
  images: number;
  stock: number; // 0 = out of stock
  featured?: boolean;
  imageUrl?: string; // primary product image (Supabase Storage), if uploaded
  gallery?: string[]; // all product images, primary first
  seoTitle?: string;
  seoDescription?: string;
  variants?: ProductVariant[]; // active variants, sorted; may be empty for legacy rows
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function formatInr(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}
