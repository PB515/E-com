import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCollection } from "@/lib/collections";
import CollectionEditor from "@/components/admin/CollectionEditor";
import CollectionProducts from "@/components/admin/CollectionProducts";

export const dynamic = "force-dynamic";

export default async function AdminCollectionEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getAdminCollection(id);
  if (!data) notFound();
  const { collection, products } = data;
  const inCount = products.filter((p) => p.inCollection).length;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/collections" className="text-sm text-ink-muted hover:text-ink">← Collections</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{collection.title}</h1>
      <p className="mt-1 text-sm text-ink-muted">{inCount} product{inCount === 1 ? "" : "s"} in this collection.</p>

      <CollectionEditor collection={collection} />

      <div className="mt-10">
        <h2 className="font-heading text-xl text-ink">Products in this collection</h2>
        <p className="mt-1 text-sm text-ink-muted">Tick to include. Star pins a product to the front; arrows set the order.</p>
        <CollectionProducts collectionId={collection.id} products={products} />
      </div>
    </div>
  );
}
