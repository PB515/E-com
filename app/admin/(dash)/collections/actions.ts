"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";

export interface CollectionInput {
  title: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
  is_active: boolean;
  show_on_home: boolean;
  sort_order: number;
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function revalidateStore(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/admin/collections");
  if (slug) revalidatePath(`/collection/${slug}`);
}

export async function createCollection(input: { title: string; slug: string }) {
  const sb = await createClient();
  const title = input.title.trim();
  const slug = slugify(input.slug || input.title);
  if (!title) return { error: "A title is required." };
  if (!slug) return { error: "A valid slug is required." };
  const { count } = await sb.from("collections").select("id", { count: "exact", head: true });
  const { error } = await sb.from("collections").insert({ title, slug, sort_order: count ?? 0 });
  if (error) return { error: error.code === "23505" ? "That slug already exists." : error.message };
  await logAdminAction("collection.create", "collection", slug, { title });
  revalidateStore(slug);
  return { ok: true as const, slug };
}

export async function updateCollection(id: string, input: CollectionInput) {
  const sb = await createClient();
  const slug = slugify(input.slug || input.title);
  if (!input.title.trim()) return { error: "A title is required." };
  if (!slug) return { error: "A valid slug is required." };
  const { error } = await sb.from("collections").update({
    title: input.title.trim(),
    slug,
    description: input.description.trim() || null,
    seo_title: input.seo_title.trim() || null,
    seo_description: input.seo_description.trim() || null,
    is_active: input.is_active,
    show_on_home: input.show_on_home,
    sort_order: input.sort_order,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.code === "23505" ? "That slug already exists." : error.message };
  await logAdminAction("collection.update", "collection", slug, { title: input.title });
  revalidateStore(slug);
  return { ok: true as const, slug };
}

export async function toggleCollectionFlag(id: string, key: "is_active" | "show_on_home", value: boolean) {
  const sb = await createClient();
  const { error } = await sb.from("collections").update({ [key]: value, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("collection.flag", "collection", id, { [key]: value });
  revalidateStore();
  return { ok: true as const };
}

export async function moveCollection(id: string, dir: "up" | "down") {
  const sb = await createClient();
  const { data: cols } = await sb.from("collections").select("id").order("sort_order").order("title");
  if (!cols) return { error: "Could not load collections." };
  const idx = cols.findIndex((c) => c.id === id);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= cols.length) return { ok: true as const };
  const ordered = [...cols];
  [ordered[idx], ordered[swapIdx]] = [ordered[swapIdx], ordered[idx]];
  for (let i = 0; i < ordered.length; i++) {
    await sb.from("collections").update({ sort_order: i }).eq("id", ordered[i].id);
  }
  await logAdminAction("collection.reorder", "collection", id, { dir });
  revalidateStore();
  return { ok: true as const };
}

export async function deleteCollection(id: string) {
  const sb = await createClient();
  const { data: col } = await sb.from("collections").select("slug").eq("id", id).maybeSingle();
  if (!col) return { error: "Collection not found." };
  // links cascade; products are untouched
  const { error } = await sb.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("collection.delete", "collection", col.slug);
  revalidateStore();
  return { ok: true as const };
}

export async function uploadCollectionImage(id: string, formData: FormData) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!file.type.startsWith("image/")) return { error: "That is not an image." };

  const admin = createAdminClient();
  const { data: col } = await admin.from("collections").select("slug").eq("id", id).maybeSingle();
  if (!col) return { error: "Collection not found." };
  const ext = file.name.split(".").pop() || "jpg";
  const path = `collections/${col.slug}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await admin.storage.from("product-images").upload(path, buffer, { contentType: file.type, upsert: false });
  if (up.error) return { error: up.error.message };
  const { data: pub } = admin.storage.from("product-images").getPublicUrl(path);
  const { error } = await admin.from("collections").update({ image_url: pub.publicUrl, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  revalidateStore(col.slug);
  return { ok: true as const, url: pub.publicUrl };
}

// ── product assignment ───────────────────────────────────────────────────────
export async function setProductInCollection(collectionId: string, productId: string, inCollection: boolean) {
  const sb = await createClient();
  if (inCollection) {
    const { count } = await sb.from("product_collections").select("product_id", { count: "exact", head: true }).eq("collection_id", collectionId);
    const { error } = await sb.from("product_collections").upsert(
      { collection_id: collectionId, product_id: productId, sort_order: count ?? 0 },
      { onConflict: "collection_id,product_id", ignoreDuplicates: true },
    );
    if (error) return { error: error.message };
  } else {
    const { error } = await sb.from("product_collections").delete().eq("collection_id", collectionId).eq("product_id", productId);
    if (error) return { error: error.message };
  }
  revalidateStore();
  revalidatePath(`/admin/collections/${collectionId}`);
  return { ok: true as const };
}

export async function setCollectionProductFeatured(collectionId: string, productId: string, value: boolean) {
  const sb = await createClient();
  const { error } = await sb.from("product_collections").update({ is_featured: value })
    .eq("collection_id", collectionId).eq("product_id", productId);
  if (error) return { error: error.message };
  revalidateStore();
  revalidatePath(`/admin/collections/${collectionId}`);
  return { ok: true as const };
}

export async function moveCollectionProduct(collectionId: string, productId: string, dir: "up" | "down") {
  const sb = await createClient();
  const { data: links } = await sb.from("product_collections").select("product_id")
    .eq("collection_id", collectionId).order("is_featured", { ascending: false }).order("sort_order");
  if (!links) return { error: "Could not load." };
  const idx = links.findIndex((l) => l.product_id === productId);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= links.length) return { ok: true as const };
  const ordered = [...links];
  [ordered[idx], ordered[swapIdx]] = [ordered[swapIdx], ordered[idx]];
  for (let i = 0; i < ordered.length; i++) {
    await sb.from("product_collections").update({ sort_order: i }).eq("collection_id", collectionId).eq("product_id", ordered[i].product_id);
  }
  revalidateStore();
  revalidatePath(`/admin/collections/${collectionId}`);
  return { ok: true as const };
}
