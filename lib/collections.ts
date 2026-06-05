import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProductRow, PRODUCT_SELECT, type ProductRow } from "@/lib/products";
import type { Product } from "@/lib/catalog";

export interface StoreCollection {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AdminCollection extends StoreCollection {
  id: string;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder: number;
  productCount?: number;
}

interface Row {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  show_on_home: boolean;
  sort_order: number;
}

const COLS = "id,slug,title,description,image_url,seo_title,seo_description,is_active,show_on_home,sort_order";

function toStore(r: Row): StoreCollection {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    imageUrl: r.image_url ?? undefined,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
  };
}

// ── Storefront reads ─────────────────────────────────────────────────────────
export async function getHomeCollections(): Promise<StoreCollection[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("collections").select(COLS)
    .eq("is_active", true).eq("show_on_home", true).order("sort_order").order("title");
  return (data ?? []).map(toStore);
}

export async function getStoreCollection(slug: string): Promise<StoreCollection | null> {
  const sb = createPublicClient();
  const { data } = await sb.from("collections").select(COLS)
    .eq("slug", slug).eq("is_active", true).maybeSingle();
  return data ? toStore(data as Row) : null;
}

// Products in a collection: featured first, then the manual sort order. Only
// active products (the link's product is inner-joined + filtered).
export async function getCollectionProducts(slug: string, limit?: number): Promise<Product[]> {
  const sb = createPublicClient();
  const { data: col } = await sb.from("collections").select("id").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!col) return [];
  let q = sb
    .from("product_collections")
    .select(`sort_order,is_featured, products!inner(${PRODUCT_SELECT})`)
    .eq("collection_id", col.id)
    .eq("products.is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order");
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? [])
    .map((r: { products: unknown }) => (r.products ? mapProductRow(r.products as ProductRow) : null))
    .filter((p): p is Product => p !== null);
}

// ── Admin reads ──────────────────────────────────────────────────────────────
export async function getAdminCollections(): Promise<AdminCollection[]> {
  const sb = createAdminClient();
  const { data } = await sb.from("collections").select(COLS).order("sort_order").order("title");
  const rows = (data ?? []) as Row[];
  const { data: links } = await sb.from("product_collections").select("collection_id");
  const counts = new Map<string, number>();
  for (const l of links ?? []) counts.set(l.collection_id, (counts.get(l.collection_id) ?? 0) + 1);
  return rows.map((r) => ({
    ...toStore(r),
    id: r.id,
    isActive: r.is_active,
    showOnHome: r.show_on_home,
    sortOrder: r.sort_order,
    productCount: counts.get(r.id) ?? 0,
  }));
}

export interface CollectionProductLink {
  productId: string;
  name: string;
  slug: string;
  category: string;
  inCollection: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

// Collection meta + EVERY active product flagged with whether it's in the
// collection (for the assignment picker on the editor).
export async function getAdminCollection(id: string): Promise<{ collection: AdminCollection; products: CollectionProductLink[] } | null> {
  const all = await getAdminCollections();
  const collection = all.find((c) => c.id === id);
  if (!collection) return null;
  const sb = createAdminClient();
  const [{ data: products }, { data: links }] = await Promise.all([
    sb.from("products").select("id,name,slug,category").eq("is_active", true).order("name"),
    sb.from("product_collections").select("product_id,sort_order,is_featured").eq("collection_id", id),
  ]);
  const linkBy = new Map((links ?? []).map((l) => [l.product_id, l]));
  const list: CollectionProductLink[] = (products ?? []).map((p) => {
    const link = linkBy.get(p.id);
    return {
      productId: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      inCollection: !!link,
      isFeatured: link?.is_featured ?? false,
      sortOrder: link?.sort_order ?? 0,
    };
  });
  // included products first (by sort), then the rest alphabetically
  list.sort((a, b) => {
    if (a.inCollection !== b.inCollection) return a.inCollection ? -1 : 1;
    if (a.inCollection) return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
  return { collection, products: list };
}
