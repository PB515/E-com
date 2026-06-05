import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminCategory } from "@/lib/categories";
import CategoryEditor from "@/components/admin/CategoryEditor";

export const dynamic = "force-dynamic";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategory(id);
  if (!category) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/categories" className="text-sm text-ink-muted hover:text-ink">← Categories</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{category.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">{category.productCount} product{category.productCount === 1 ? "" : "s"} in this category.</p>
      <CategoryEditor category={category} />
    </div>
  );
}
