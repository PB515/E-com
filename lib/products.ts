import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product, CategorySlug } from "@/lib/catalog";

// Server data layer — reads PUBLIC product data from Supabase (anon, active
// only). Maps DB snake_case rows to the Product shape the components use.
// Admin edits (price/stock/story) reflect here on the next request.

interface ProductRow {
  slug: string;
  name: string;
  category: CategorySlug;
  price_inr: number;
  motif: string | null;
  region: string | null;
  occasion: string | null;
  story: string | null;
  material: string | null;
  size: string | null;
  care: string | null;
  images: number;
  stock: number;
  featured: boolean;
}

function mapRow(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    priceInr: r.price_inr,
    motif: r.motif ?? "",
    region: r.region ?? "",
    occasion: r.occasion ?? "",
    story: r.story ?? "",
    material: r.material ?? "",
    size: r.size ?? "",
    care: r.care ?? "",
    images: r.images,
    stock: r.stock,
    featured: r.featured,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("name");
  return (data ?? []).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data ? mapRow(data) : null;
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", category)
    .order("name");
  return (data ?? []).map(mapRow);
}

export async function getFeatured(): Promise<Product[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("featured", true)
    .order("name");
  return (data ?? []).map(mapRow);
}

export async function getRelated(
  product: Product,
  n = 3,
): Promise<Product[]> {
  const all = await getAllProducts();
  const sameCat = all.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const others = all.filter((p) => p.category !== product.category);
  return [...sameCat, ...others].slice(0, n);
}
