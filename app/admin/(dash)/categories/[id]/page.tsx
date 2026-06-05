import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCategory, getAdminCategoryProducts } from "@/lib/categories";
import CategoryEditor from "@/components/admin/CategoryEditor";
import CategoryProducts from "@/components/admin/CategoryProducts";

export const dynamic = "force-dynamic";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);
  if (!category) notFound();
  const productLinks = await getAdminCategoryProducts(id);
  const inCount = productLinks.filter((p) => p.inCategory).length;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/categories" className="text-sm text-ink-muted hover:text-ink">← Categories</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{category.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">{inCount} product{inCount === 1 ? "" : "s"} in this category.</p>
      <CategoryEditor category={category} />

      <div className="mt-10">
        <h2 className="font-heading text-xl text-ink">Products in this category</h2>
        <p className="mt-1 text-sm text-ink-muted">Tick to add a product to this category (a product can be in several). Star pins it to the front; arrows set the order on the category page.</p>
        <CategoryProducts categoryId={category.id} products={productLinks} />
      </div>
    </div>
  );
}
