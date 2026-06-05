import { getAdminCategories } from "@/lib/categories";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Categories</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Product types shown in the nav, homepage grid, and footer. Reorder, hide, or rename without touching code.
        A category in use by products can be hidden but not deleted.
      </p>
      <CategoryManager initial={categories} />
    </div>
  );
}
