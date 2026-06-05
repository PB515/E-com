import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product, CategorySlug } from "@/lib/catalog";

// Server data layer — reads PUBLIC product data from Supabase (anon, active
// only), with the primary product image embedded. Admin edits reflect on the
// next request.

const SELECT = "*, product_images(url,is_primary,sort_order)";

interface ProductImageRow {
  url: string;
  is_primary: boolean | null;
  sort_order: number | null;
}
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
  product_images?: ProductImageRow[] | null;
}

function galleryUrls(rows?: ProductImageRow[] | null): string[] {
  if (!rows || rows.length === 0) return [];
  return [...rows]
    .sort(
      (a, b) =>
        (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
        (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )
    .map((r) => r.url);
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
    gallery: galleryUrls(r.product_images),
    imageUrl: galleryUrls(r.product_images)[0],
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select(SELECT)
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("name");
  return (data ?? []).map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select(SELECT)
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
    .select(SELECT)
    .eq("is_active", true)
    .eq("category", category)
    .order("name");
  return (data ?? []).map(mapRow);
}

export async function getFeatured(): Promise<Product[]> {
  const sb = createPublicClient();
  const { data } = await sb
    .from("products")
    .select(SELECT)
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
