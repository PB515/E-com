import { getAdminInstagramPosts } from "@/lib/instagram";
import { instagramConfigured } from "@/lib/instagram-sync";
import InstagramManager from "@/components/admin/InstagramManager";
import InstagramSync from "@/components/admin/InstagramSync";
import { INSTAGRAM_HANDLE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminInstagramPage() {
  const posts = await getAdminInstagramPosts();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Instagram</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        The &ldquo;From our Instagram&rdquo; grid on the homepage ({INSTAGRAM_HANDLE}). Auto-sync from the Meta API,
        or add posts manually below. A card needs a thumbnail to show.
      </p>
      <InstagramSync configured={instagramConfigured()} />
      <InstagramManager initial={posts} />
    </div>
  );
}
