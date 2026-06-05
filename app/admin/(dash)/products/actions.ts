"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";
import { applyStockMovement, recomputeProductStock, type StockMovementInput } from "@/lib/stock";

export interface ProductFields {
  name: string;
  price_inr: number;
  stock: number;
  hsn_code: string;
  gst_rate: number;
  is_active: boolean;
  motif: string;
  region: string;
  occasion: string;
  story: string;
  material: string;
  size: string;
  care: string;
  seo_title: string;
  seo_description: string;
  weight_grams: number | null;
  length_cm: number | null;
  breadth_cm: number | null;
  height_cm: number | null;
}

const CATEGORIES = ["ear-cuffs", "earrings", "bracelets", "hasli", "pendants"];

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function updateProduct(slug: string, fields: ProductFields) {
  const sb = await createClient();
  // stock is now derived from variants (the mirror) — never overwrite it here
  const { stock: _ignored, ...rest } = fields;
  void _ignored;
  const { error } = await sb
    .from("products")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) return { error: error.message };
  await logAdminAction("product.update", "product", slug, { price: fields.price_inr, stock: fields.stock });
  revalidateStorefront(slug);
  return { ok: true as const };
}

export interface CreateProductInput extends ProductFields {
  slug: string;
  category: string;
  featured: boolean;
}

export async function createProduct(input: CreateProductInput) {
  const sb = await createClient(); // RLS enforces admin on the write
  const slug = slugify(input.slug || input.name);
  if (!slug) return { error: "A name or slug is required." };
  if (!CATEGORIES.includes(input.category)) return { error: "Pick a valid category." };

  const { data: created, error } = await sb.from("products").insert({
    slug,
    category: input.category,
    name: input.name,
    price_inr: input.price_inr,
    stock: input.stock,
    hsn_code: input.hsn_code || "7117",
    gst_rate: input.gst_rate || 12,
    is_active: input.is_active,
    featured: input.featured,
    motif: input.motif,
    region: input.region,
    occasion: input.occasion,
    story: input.story,
    material: input.material,
    size: input.size,
    care: input.care,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    weight_grams: input.weight_grams,
    length_cm: input.length_cm,
    breadth_cm: input.breadth_cm,
    height_cm: input.height_cm,
    images: 1,
  }).select("id").single();
  if (error || !created) {
    return { error: error?.code === "23505" ? "That slug already exists." : (error?.message ?? "Could not create.") };
  }
  // every product gets a default variant (stock lives on variants)
  await sb.from("product_variants").insert({ product_id: created.id, label: "Standard", stock: Math.max(0, Math.floor(input.stock || 0)), sort_order: 0 });
  await logAdminAction("product.create", "product", slug, { name: input.name });
  revalidateStorefront(slug);
  return { ok: true as const, slug };
}

export async function deleteProduct(slug: string) {
  const sb = await createClient();
  const { error } = await sb.from("products").delete().eq("slug", slug);
  if (error) {
    // FK restrict: product is referenced by an order
    if (error.code === "23503")
      return { error: "This product is in an order. Deactivate it instead of deleting." };
    return { error: error.message };
  }
  await logAdminAction("product.delete", "product", slug);
  revalidateStorefront();
  return { ok: true as const };
}

export async function setStock(slug: string, stock: number) {
  const sb = await createClient();
  const { error } = await sb
    .from("products")
    .update({ stock: Math.max(0, Math.floor(stock)) })
    .eq("slug", slug);
  if (error) return { error: error.message };
  await logAdminAction("product.stock", "product", slug, { stock });
  revalidateStorefront(slug);
  return { ok: true as const };
}

// Upload a primary product image. Admin-verified, then the service-role client
// handles Storage (no extra storage policies needed) and the image row.
export async function uploadProductImage(slug: string, formData: FormData) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!file.type.startsWith("image/")) return { error: "That is not an image." };

  const admin = createAdminClient();
  const { data: product } = await admin.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!product) return { error: "Product not found." };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await admin.storage.from("product-images").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (up.error) return { error: up.error.message };

  const { data: pub } = admin.storage.from("product-images").getPublicUrl(path);
  // first image becomes primary; additional images are added to the gallery
  const { data: existing } = await admin
    .from("product_images")
    .select("id")
    .eq("product_id", product.id);
  const isFirst = !existing || existing.length === 0;
  const { error: insErr } = await admin.from("product_images").insert({
    product_id: product.id,
    url: pub.publicUrl,
    is_primary: isFirst,
    sort_order: existing?.length ?? 0,
  });
  if (insErr) return { error: insErr.message };

  revalidateStorefront(slug);
  return { ok: true as const, url: pub.publicUrl };
}

export async function setPrimaryImage(slug: string, imageId: string) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { data: product } = await admin.from("products").select("id").eq("slug", slug).maybeSingle();
  if (!product) return { error: "Product not found." };
  await admin.from("product_images").update({ is_primary: false }).eq("product_id", product.id);
  const { error } = await admin.from("product_images").update({ is_primary: true }).eq("id", imageId);
  if (error) return { error: error.message };
  revalidateStorefront(slug);
  return { ok: true as const };
}

export async function deleteProductImage(slug: string, imageId: string) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { data: img } = await admin.from("product_images").select("url,is_primary,product_id").eq("id", imageId).maybeSingle();
  const { error } = await admin.from("product_images").delete().eq("id", imageId);
  if (error) return { error: error.message };
  // best-effort: remove the storage object + promote another image to primary
  if (img) {
    try {
      const marker = "/product-images/";
      const i = img.url.indexOf(marker);
      if (i >= 0) await admin.storage.from("product-images").remove([img.url.slice(i + marker.length)]);
    } catch {
      // ignore storage cleanup failure
    }
    if (img.is_primary) {
      const { data: next } = await admin.from("product_images").select("id").eq("product_id", img.product_id).order("sort_order").limit(1).maybeSingle();
      if (next) await admin.from("product_images").update({ is_primary: true }).eq("id", next.id);
    }
  }
  revalidateStorefront(slug);
  return { ok: true as const };
}

// ── Variants ───────────────────────────────────────────────────────────────
export async function addVariant(slug: string, productId: string, input: { label: string; sku: string; price_inr: number | null; stock: number }) {
  const sb = await createClient();
  const { error } = await sb.from("product_variants").insert({
    product_id: productId,
    label: input.label || "Variant",
    sku: input.sku || null,
    price_inr: input.price_inr,
    stock: Math.max(0, Math.floor(input.stock || 0)),
  });
  if (error) return { error: error.message };
  await recomputeProductStock(createAdminClient(), productId);
  await logAdminAction("variant.add", "product", slug, { label: input.label });
  revalidateStorefront(slug);
  return { ok: true as const };
}

export async function updateVariant(variantId: string, slug: string, productId: string, input: { label: string; sku: string; price_inr: number | null; is_active: boolean }) {
  const sb = await createClient();
  const { error } = await sb.from("product_variants").update({
    label: input.label || "Variant",
    sku: input.sku || null,
    price_inr: input.price_inr,
    is_active: input.is_active,
  }).eq("id", variantId);
  if (error) return { error: error.message };
  await recomputeProductStock(createAdminClient(), productId);
  revalidateStorefront(slug);
  return { ok: true as const };
}

export async function deleteVariant(variantId: string, slug: string, productId: string) {
  const sb = await createClient();
  const { error } = await sb.from("product_variants").delete().eq("id", variantId);
  if (error) {
    if (error.code === "23503") return { error: "This variant is in an order. Deactivate it instead." };
    return { error: error.message };
  }
  await recomputeProductStock(createAdminClient(), productId);
  revalidateStorefront(slug);
  return { ok: true as const };
}

export async function adjustVariantStock(variantId: string, slug: string, productId: string, delta: number, reason: string, note: string) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const { data: { user } } = await supa.auth.getUser();
  await applyStockMovement(createAdminClient(), {
    variantId,
    productId,
    delta: Math.floor(delta),
    reason: reason as StockMovementInput["reason"],
    note: note || undefined,
    actorEmail: user?.email ?? undefined,
  });
  await logAdminAction("stock.adjust", "variant", variantId, { delta, reason });
  revalidateStorefront(slug);
  return { ok: true as const };
}
