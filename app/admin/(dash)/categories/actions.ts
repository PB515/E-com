"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";

export interface CategoryInput {
  name: string;
  slug: string;
  blurb: string;
  description: string;
  seo_title: string;
  seo_description: string;
  is_active: boolean;
  show_in_nav: boolean;
  show_on_home: boolean;
  show_in_footer: boolean;
  nav_order: number;
  home_order: number;
  footer_order: number;
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Storefront chrome (nav/footer) + home + the category page all read categories,
// so refresh the whole storefront on any change.
function revalidateStore(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  if (slug) revalidatePath(`/category/${slug}`);
}

export async function createCategory(input: { name: string; slug: string }) {
  const sb = await createClient(); // RLS enforces admin
  const name = input.name.trim();
  const slug = slugify(input.slug || input.name);
  if (!name) return { error: "A name is required." };
  if (!slug) return { error: "A valid slug is required." };

  // append after the current last in each ordering
  const { count } = await sb.from("categories").select("id", { count: "exact", head: true });
  const order = count ?? 0;

  const { error } = await sb.from("categories").insert({
    name, slug, nav_order: order, home_order: order, footer_order: order,
  });
  if (error) return { error: error.code === "23505" ? "That slug already exists." : error.message };
  await logAdminAction("category.create", "category", slug, { name });
  revalidateStore(slug);
  return { ok: true as const, slug };
}

export async function updateCategory(id: string, input: CategoryInput) {
  const sb = await createClient();
  const slug = slugify(input.slug || input.name);
  if (!input.name.trim()) return { error: "A name is required." };
  if (!slug) return { error: "A valid slug is required." };

  const { error } = await sb.from("categories").update({
    name: input.name.trim(),
    slug,
    blurb: input.blurb.trim() || null,
    description: input.description.trim() || null,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
    is_active: input.is_active,
    show_in_nav: input.show_in_nav,
    show_on_home: input.show_on_home,
    show_in_footer: input.show_in_footer,
    nav_order: input.nav_order,
    home_order: input.home_order,
    footer_order: input.footer_order,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  // a slug change cascades to products via the FK (ON UPDATE CASCADE)
  if (error) return { error: error.code === "23505" ? "That slug already exists." : error.message };
  await logAdminAction("category.update", "category", slug, { name: input.name });
  revalidateStore(slug);
  return { ok: true as const, slug };
}

// Inline quick-toggle for a single visibility/active flag.
export async function toggleCategoryFlag(
  id: string,
  key: "is_active" | "show_in_nav" | "show_on_home" | "show_in_footer",
  value: boolean,
) {
  const sb = await createClient();
  const { error } = await sb.from("categories").update({ [key]: value, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("category.flag", "category", id, { [key]: value });
  revalidateStore();
  return { ok: true as const };
}

// Nudge a category up/down in ALL three orderings together (simple v1 reorder).
export async function moveCategory(id: string, dir: "up" | "down") {
  const sb = await createClient();
  const { data: cats } = await sb.from("categories").select("id,nav_order").order("nav_order").order("name");
  if (!cats) return { error: "Could not load categories." };
  const idx = cats.findIndex((c) => c.id === id);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= cats.length) return { ok: true as const };
  const a = cats[idx], b = cats[swapIdx];
  // assign sequential orders, swapping the two neighbours
  const ordered = [...cats];
  ordered[idx] = b; ordered[swapIdx] = a;
  for (let i = 0; i < ordered.length; i++) {
    await sb.from("categories").update({ nav_order: i, home_order: i, footer_order: i }).eq("id", ordered[i].id);
  }
  await logAdminAction("category.reorder", "category", id, { dir });
  revalidateStore();
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  const sb = await createClient();
  const { data: cat } = await sb.from("categories").select("slug").eq("id", id).maybeSingle();
  if (!cat) return { error: "Category not found." };
  // guard: never delete a category that still has products (SEO + data safety)
  const { count } = await sb.from("products").select("id", { count: "exact", head: true }).eq("category", cat.slug);
  if ((count ?? 0) > 0) return { error: `In use by ${count} product${count === 1 ? "" : "s"}. Hide it instead, or move those products first.` };
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("category.delete", "category", cat.slug);
  revalidateStore();
  return { ok: true as const };
}

// ── product membership / merchandising ───────────────────────────────────────
export async function setProductInCategory(categoryId: string, productId: string, inCategory: boolean) {
  const sb = await createClient();
  if (inCategory) {
    const { count } = await sb.from("product_categories").select("product_id", { count: "exact", head: true }).eq("category_id", categoryId);
    const { error } = await sb.from("product_categories").upsert(
      { category_id: categoryId, product_id: productId, sort_order: count ?? 0 },
      { onConflict: "category_id,product_id", ignoreDuplicates: true },
    );
    if (error) return { error: error.message };
  } else {
    // never remove a product's PRIMARY (home) category membership here
    const { data: link } = await sb.from("product_categories").select("is_primary").eq("category_id", categoryId).eq("product_id", productId).maybeSingle();
    if (link?.is_primary) return { error: "This is the product's primary category — it can't be removed here." };
    const { error } = await sb.from("product_categories").delete().eq("category_id", categoryId).eq("product_id", productId);
    if (error) return { error: error.message };
  }
  revalidateStore();
  revalidatePath(`/admin/categories/${categoryId}`);
  return { ok: true as const };
}

export async function setCategoryProductFeatured(categoryId: string, productId: string, value: boolean) {
  const sb = await createClient();
  const { error } = await sb.from("product_categories").update({ is_featured: value }).eq("category_id", categoryId).eq("product_id", productId);
  if (error) return { error: error.message };
  revalidateStore();
  revalidatePath(`/admin/categories/${categoryId}`);
  return { ok: true as const };
}

export async function moveCategoryProduct(categoryId: string, productId: string, dir: "up" | "down") {
  const sb = await createClient();
  const { data: links } = await sb.from("product_categories").select("product_id")
    .eq("category_id", categoryId).order("is_featured", { ascending: false }).order("sort_order");
  if (!links) return { error: "Could not load." };
  const idx = links.findIndex((l) => l.product_id === productId);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= links.length) return { ok: true as const };
  const ordered = [...links];
  [ordered[idx], ordered[swapIdx]] = [ordered[swapIdx], ordered[idx]];
  for (let i = 0; i < ordered.length; i++) {
    await sb.from("product_categories").update({ sort_order: i }).eq("category_id", categoryId).eq("product_id", ordered[i].product_id);
  }
  revalidateStore();
  revalidatePath(`/admin/categories/${categoryId}`);
  return { ok: true as const };
}

// Category card image. Admin-verified, then service-role handles Storage.
export async function uploadCategoryImage(id: string, formData: FormData) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!file.type.startsWith("image/")) return { error: "That is not an image." };

  const admin = createAdminClient();
  const { data: cat } = await admin.from("categories").select("slug").eq("id", id).maybeSingle();
  if (!cat) return { error: "Category not found." };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `categories/${cat.slug}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await admin.storage.from("product-images").upload(path, buffer, { contentType: file.type, upsert: false });
  if (up.error) return { error: up.error.message };
  const { data: pub } = admin.storage.from("product-images").getPublicUrl(path);
  const { error } = await admin.from("categories").update({ image_url: pub.publicUrl, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  revalidateStore(cat.slug);
  return { ok: true as const, url: pub.publicUrl };
}
