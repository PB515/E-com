import { getAdminCollections } from "@/lib/collections";
import CollectionManager from "@/components/admin/CollectionManager";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Collections</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Marketing groupings — Festive Picks, Under ₹999, Best Sellers. A product can sit in many collections at once,
        separate from its permanent category. &ldquo;Show on home&rdquo; collections appear as rails on the homepage.
      </p>
      <CollectionManager initial={collections} />
    </div>
  );
}
