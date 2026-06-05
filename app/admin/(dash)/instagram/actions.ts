"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";
import { syncInstagram } from "@/lib/instagram-sync";

function revalidateStore() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/instagram");
}

export async function createInstagramPost(input: { url: string; is_reel: boolean }) {
  const sb = await createClient();
  const url = input.url.trim();
  if (!url) return { error: "Paste the Instagram post or reel link." };
  if (!/instagram\.com/i.test(url)) return { error: "That doesn't look like an Instagram link." };
  const { count } = await sb.from("instagram_posts").select("id", { count: "exact", head: true });
  const { data, error } = await sb.from("instagram_posts").insert({ url, is_reel: input.is_reel, sort_order: count ?? 0 }).select("id").single();
  if (error || !data) return { error: error?.message ?? "Could not add." };
  await logAdminAction("instagram.create", "instagram", data.id, { is_reel: input.is_reel });
  revalidateStore();
  return { ok: true as const, id: data.id };
}

export async function updateInstagramPost(id: string, input: { url: string; caption: string; is_reel: boolean }) {
  const sb = await createClient();
  const url = input.url.trim();
  if (!url) return { error: "A link is required." };
  if (!/instagram\.com/i.test(url)) return { error: "That doesn't look like an Instagram link." };
  const { error } = await sb.from("instagram_posts").update({
    url, caption: input.caption.trim() || null, is_reel: input.is_reel, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidateStore();
  return { ok: true as const };
}

export async function toggleInstagramActive(id: string, value: boolean) {
  const sb = await createClient();
  const { error } = await sb.from("instagram_posts").update({ is_active: value, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  revalidateStore();
  return { ok: true as const };
}

export async function moveInstagramPost(id: string, dir: "up" | "down") {
  const sb = await createClient();
  const { data: rows } = await sb.from("instagram_posts").select("id").order("sort_order").order("created_at", { ascending: false });
  if (!rows) return { error: "Could not load." };
  const idx = rows.findIndex((r) => r.id === id);
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= rows.length) return { ok: true as const };
  const ordered = [...rows];
  [ordered[idx], ordered[swapIdx]] = [ordered[swapIdx], ordered[idx]];
  for (let i = 0; i < ordered.length; i++) {
    await sb.from("instagram_posts").update({ sort_order: i }).eq("id", ordered[i].id);
  }
  revalidateStore();
  return { ok: true as const };
}

export async function deleteInstagramPost(id: string) {
  const sb = await createClient();
  const { error } = await sb.from("instagram_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("instagram.delete", "instagram", id);
  revalidateStore();
  return { ok: true as const };
}

// Pull recent posts from the connected Instagram account (Meta Graph API).
export async function syncInstagramNow() {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const r = await syncInstagram(12);
  if (!r.ok) return { error: r.error };
  await logAdminAction("instagram.sync", "instagram", "feed", { synced: r.synced });
  revalidateStore();
  return { ok: true as const, synced: r.synced ?? 0, skipped: r.skipped ?? 0 };
}

export async function uploadInstagramImage(id: string, formData: FormData) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!file.type.startsWith("image/")) return { error: "That is not an image." };

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `instagram/${id}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await admin.storage.from("product-images").upload(path, buffer, { contentType: file.type, upsert: false });
  if (up.error) return { error: up.error.message };
  const { data: pub } = admin.storage.from("product-images").getPublicUrl(path);
  const { error } = await admin.from("instagram_posts").update({ image_url: pub.publicUrl, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  revalidateStore();
  return { ok: true as const, url: pub.publicUrl };
}
