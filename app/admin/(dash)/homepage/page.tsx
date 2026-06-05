import { getRawSiteContent } from "@/lib/site-content";
import HomepageEditor from "@/components/admin/HomepageEditor";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const raw = await getRawSiteContent();
  const heroImage = raw.hero_image_url ?? "";
  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl text-ink">Homepage</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Edit the homepage hero, section titles, trust strip, and newsletter band. Leave a field blank to use the built-in default.
      </p>
      <HomepageEditor initial={raw} heroImage={heroImage} />
    </div>
  );
}
