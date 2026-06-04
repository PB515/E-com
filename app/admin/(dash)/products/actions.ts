"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const { error } = await sb
    .from("products")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (error) return { error: error.message };
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

  const { error } = await sb.from("products").insert({
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
    images: 1,
  });
  if (error) {
    return { error: error.code === "23505" ? "That slug already exists." : error.message };
  }
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
  // make this the primary image
  await admin.from("product_images").update({ is_primary: false }).eq("product_id", product.id);
  const { error: insErr } = await admin.from("product_images").insert({
    product_id: product.id,
    url: pub.publicUrl,
    is_primary: true,
    sort_order: 0,
  });
  if (insErr) return { error: insErr.message };

  revalidateStorefront(slug);
  return { ok: true as const, url: pub.publicUrl };
}
