"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/audit";

const FIELDS = [
  "hero_title", "hero_subtitle", "hero_cta1_label", "hero_cta1_href",
  "hero_cta2_label", "hero_cta2_href", "category_title", "featured_title",
  "newsletter_title", "newsletter_subtitle",
  "trust1_label", "trust1_sub", "trust2_label", "trust2_sub",
  "trust3_label", "trust3_sub", "trust4_label", "trust4_sub",
] as const;

function revalidateHome() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/homepage");
}

// Blank fields are stored as NULL so the storefront falls back to the built-in
// default — this is how an admin "resets" a field to default.
export async function updateSiteContent(input: Record<string, string>) {
  const sb = await createClient();
  const patch: Record<string, string | null> = { updated_at: new Date().toISOString() };
  for (const f of FIELDS) {
    const v = (input[f] ?? "").trim();
    patch[f] = v ? v : null;
  }
  const { error } = await sb.from("site_content").update(patch).eq("id", 1);
  if (error) return { error: error.message };
  await logAdminAction("homepage.update", "site_content", "1");
  revalidateHome();
  return { ok: true as const };
}

export async function uploadHeroImage(formData: FormData) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file." };
  if (!file.type.startsWith("image/")) return { error: "That is not an image." };

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `site/hero/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await admin.storage.from("product-images").upload(path, buffer, { contentType: file.type, upsert: false });
  if (up.error) return { error: up.error.message };
  const { data: pub } = admin.storage.from("product-images").getPublicUrl(path);
  const { error } = await admin.from("site_content").update({ hero_image_url: pub.publicUrl, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateHome();
  return { ok: true as const, url: pub.publicUrl };
}

export async function clearHeroImage() {
  const sb = await createClient();
  const { error } = await sb.from("site_content").update({ hero_image_url: null, updated_at: new Date().toISOString() }).eq("id", 1);
  if (error) return { error: error.message };
  revalidateHome();
  return { ok: true as const };
}
