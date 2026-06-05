import { getAdminInstagramPosts } from "@/lib/instagram";
import InstagramManager from "@/components/admin/InstagramManager";
import { INSTAGRAM_HANDLE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminInstagramPage() {
  const posts = await getAdminInstagramPosts();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Instagram</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Curate the &ldquo;From our Instagram&rdquo; grid on the homepage ({INSTAGRAM_HANDLE}). Paste a post or reel link,
        upload a thumbnail, and it appears on the site. A card needs a thumbnail to show.
      </p>
      <InstagramManager initial={posts} />
    </div>
  );
}
