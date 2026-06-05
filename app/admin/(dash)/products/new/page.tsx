import Link from "next/link";
import NewProductForm from "@/components/admin/NewProductForm";
import { getAdminCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const cats = (await getAdminCategories()).filter((c) => c.isActive);
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">← Products</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">New product</h1>
      {cats.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          No active categories yet. Add one in <Link href="/admin/categories" className="underline">Categories</Link> first.
        </p>
      ) : (
        <NewProductForm categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
      )}
    </div>
  );
}
