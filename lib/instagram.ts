import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";

export interface InstaPost {
  id: string;
  url: string;
  imageUrl?: string;
  caption: string;
  isReel: boolean;
}

export interface AdminInstaPost extends InstaPost {
  isActive: boolean;
  sortOrder: number;
}

interface Row {
  id: string;
  url: string;
  image_url: string | null;
  caption: string | null;
  is_reel: boolean;
  is_active: boolean;
  sort_order: number;
}

const COLS = "id,url,image_url,caption,is_reel,is_active,sort_order";

function toPost(r: Row): InstaPost {
  return { id: r.id, url: r.url, imageUrl: r.image_url ?? undefined, caption: r.caption ?? "", isReel: r.is_reel };
}

// Storefront: active posts that have a thumbnail (a card needs an image).
export async function getInstagramPosts(limit?: number): Promise<InstaPost[]> {
  try {
    const sb = createPublicClient();
    let q = sb.from("instagram_posts").select(COLS).eq("is_active", true).order("sort_order").order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    return (data ?? []).filter((r) => r.image_url).map((r) => toPost(r as Row));
  } catch {
    return [];
  }
}

// Admin: every post (incl. hidden / thumbnail-less).
export async function getAdminInstagramPosts(): Promise<AdminInstaPost[]> {
  const sb = createAdminClient();
  const { data } = await sb.from("instagram_posts").select(COLS).order("sort_order").order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({ ...toPost(r as Row), isActive: (r as Row).is_active, sortOrder: (r as Row).sort_order }));
}
