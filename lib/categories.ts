import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProductRow, PRODUCT_SELECT, type ProductRow } from "@/lib/products";
import type { Product } from "@/lib/catalog";

// Server data layer for admin-managed categories. Storefront reads use the
// public (anon) client + RLS public-read; admin listing uses the service-role
// client so inactive/hidden categories are visible in the manager.

export interface StoreCategory {
  slug: string;
  name: string;
  blurb: string;
  description: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AdminCategory extends StoreCategory {
  id: string;
  isActive: boolean;
  showInNav: boolean;
  showOnHome: boolean;
  showInFooter: boolean;
  navOrder: number;
  homeOrder: number;
  footerOrder: number;
  productCount?: number;
}

interface Row {
  id: string;
  slug: string;
  name: string;
  blurb: string | null;
  description: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  show_in_nav: boolean;
  show_on_home: boolean;
  show_in_footer: boolean;
  nav_order: number;
  home_order: number;
  footer_order: number;
}

function toStore(r: Row): StoreCategory {
  return {
    slug: r.slug,
    name: r.name,
    blurb: r.blurb ?? "",
    description: r.description ?? "",
    imageUrl: r.image_url ?? undefined,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
  };
}

const COLS =
  "id,slug,name,blurb,description,image_url,seo_title,seo_description,is_active,show_in_nav,show_on_home,show_in_footer,nav_order,home_order,footer_order";

// ── Storefront reads (active only, respecting the per-surface visibility) ────
export async function getNavCategories(): Promise<StoreCategory[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select(COLS)
    .eq("is_active", true).eq("show_in_nav", true).order("nav_order").order("name");
  return (data ?? []).map(toStore);
}

export async function getFooterCategories(): Promise<StoreCategory[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select(COLS)
    .eq("is_active", true).eq("show_in_footer", true).order("footer_order").order("name");
  return (data ?? []).map(toStore);
}

export async function getHomeCategories(): Promise<StoreCategory[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select(COLS)
    .eq("is_active", true).eq("show_on_home", true).order("home_order").order("name");
  return (data ?? []).map(toStore);
}

// Every active category (e.g. the shop filter chips).
export async function getActiveCategories(): Promise<StoreCategory[]> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select(COLS)
    .eq("is_active", true).order("nav_order").order("name");
  return (data ?? []).map(toStore);
}

// Just the display name for a slug (regardless of active) — for breadcrumbs.
export async function getCategoryLabel(slug: string): Promise<{ slug: string; name: string } | null> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select("slug,name").eq("slug", slug).maybeSingle();
  return data ?? null;
}

// A single active category for its storefront page (null when hidden/missing).
export async function getStoreCategory(slug: string): Promise<StoreCategory | null> {
  const sb = createPublicClient();
  const { data } = await sb.from("categories").select(COLS)
    .eq("slug", slug).eq("is_active", true).maybeSingle();
  return data ? toStore(data as Row) : null;
}

// ── Admin reads (everything, including hidden/inactive) ──────────────────────
export async function getAdminCategories(): Promise<AdminCategory[]> {
  const sb = createAdminClient();
  const { data } = await sb.from("categories").select(COLS).order("nav_order").order("name");
  const rows = (data ?? []) as Row[];
  // member count per category (primary + secondary), from the link table
  const { data: links } = await sb.from("product_categories").select("category_id");
  const counts = new Map<string, number>();
  for (const l of links ?? []) counts.set(l.category_id, (counts.get(l.category_id) ?? 0) + 1);
  return rows.map((r) => ({
    ...toStore(r),
    id: r.id,
    isActive: r.is_active,
    showInNav: r.show_in_nav,
    showOnHome: r.show_on_home,
    showInFooter: r.show_in_footer,
    navOrder: r.nav_order,
    homeOrder: r.home_order,
    footerOrder: r.footer_order,
    productCount: counts.get(r.id) ?? 0,
  }));
}

export async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  const all = await getAdminCategories();
  return all.find((c) => c.id === id) ?? null;
}

// Products shown on a category page: every member (primary + secondary),
// featured first, then the manual sort order. Active products only.
export async function getCategoryProducts(slug: string, limit?: number): Promise<Product[]> {
  const sb = createPublicClient();
  const { data: cat } = await sb.from("categories").select("id").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!cat) return [];
  let q = sb
    .from("product_categories")
    .select(`sort_order,is_featured, products!inner(${PRODUCT_SELECT})`)
    .eq("category_id", cat.id)
    .eq("products.is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order");
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? [])
    .map((r: { products: unknown }) => (r.products ? mapProductRow(r.products as ProductRow) : null))
    .filter((p): p is Product => p !== null);
}

export interface CategoryProductLink {
  productId: string;
  name: string;
  slug: string;
  primaryCategory: string;
  inCategory: boolean;
  isPrimary: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

// Category meta + EVERY active product flagged with its membership in THIS
// category (for the merchandising picker on the category editor).
export async function getAdminCategoryProducts(id: string): Promise<CategoryProductLink[]> {
  const sb = createAdminClient();
  const [{ data: products }, { data: links }] = await Promise.all([
    sb.from("products").select("id,name,slug,category").eq("is_active", true).order("name"),
    sb.from("product_categories").select("product_id,sort_order,is_featured,is_primary").eq("category_id", id),
  ]);
  const linkBy = new Map((links ?? []).map((l) => [l.product_id, l]));
  const list: CategoryProductLink[] = (products ?? []).map((p) => {
    const link = linkBy.get(p.id);
    return {
      productId: p.id,
      name: p.name,
      slug: p.slug,
      primaryCategory: p.category,
      inCategory: !!link,
      isPrimary: link?.is_primary ?? false,
      isFeatured: link?.is_featured ?? false,
      sortOrder: link?.sort_order ?? 0,
    };
  });
  list.sort((a, b) => {
    if (a.inCategory !== b.inCategory) return a.inCategory ? -1 : 1;
    if (a.inCategory) return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });
  return list;
}
