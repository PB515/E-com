import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { igFetchMedia } from "@/lib/instagram/graph";

// The token is a SECRET — it lives in the environment only (.env.local / Vercel),
// referenced by name, never in code or the DB.
export function instagramConfigured(): boolean {
  return !!process.env.INSTAGRAM_ACCESS_TOKEN;
}

export interface SyncResult {
  ok: boolean;
  synced?: number;
  skipped?: number;
  error?: string;
}

// Pull recent posts and mirror them into instagram_posts. Images are DOWNLOADED
// into our own storage (Instagram CDN URLs are signed + expire), so the cards
// keep working. Synced rows are keyed by ig_media_id and updated in place on
// re-sync; manually-added posts (source='manual') are left untouched.
export async function syncInstagram(limit = 12): Promise<SyncResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { ok: false, error: "INSTAGRAM_ACCESS_TOKEN is not set." };

  const sb = createAdminClient();
  let media;
  try {
    media = await igFetchMedia(token, limit);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Instagram fetch failed." };
  }

  let synced = 0;
  let skipped = 0;
  let order = 0;
  for (const m of media) {
    const isVideo = m.media_type === "VIDEO";
    const imgSrc = isVideo ? m.thumbnail_url || m.media_url : m.media_url;
    if (!imgSrc) {
      skipped++;
      continue;
    }

    // download the cover image into our storage
    let storedUrl: string | null = null;
    try {
      const r = await fetch(imgSrc, { cache: "no-store" });
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        const ct = r.headers.get("content-type") || "image/jpeg";
        const ext = ct.includes("png") ? "png" : "jpg";
        const path = `instagram/ig/${m.id}.${ext}`;
        const up = await sb.storage.from("product-images").upload(path, buf, { contentType: ct, upsert: true });
        if (!up.error) storedUrl = sb.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      }
    } catch {
      // image download is best-effort
    }
    if (!storedUrl) {
      skipped++;
      continue;
    }

    const row = {
      url: m.permalink,
      image_url: storedUrl,
      caption: (m.caption ?? "").slice(0, 200),
      is_reel: isVideo,
      source: "instagram",
      ig_media_id: m.id,
    };

    // upsert by ig_media_id (partial unique index → do it explicitly)
    const { data: existing } = await sb.from("instagram_posts").select("id").eq("ig_media_id", m.id).maybeSingle();
    if (existing) {
      await sb.from("instagram_posts").update({ ...row, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await sb.from("instagram_posts").insert({ ...row, is_active: true, sort_order: order });
    }
    order++;
    synced++;
  }

  return { ok: true, synced, skipped };
}
