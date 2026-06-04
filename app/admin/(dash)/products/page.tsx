import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("products")
    .select("slug,name,category,price_inr,stock,is_active")
    .order("category")
    .order("name");

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Products</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Edit price, stock, HSN, GST rate, and the heritage story. Changes reflect
        on the storefront and on future invoices.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p: any) => (
              <tr key={p.slug} className="border-t border-border">
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(p.price_inr)}</td>
                <td className="px-4 py-3 text-right text-ink">{p.stock}</td>
                <td className="px-4 py-3 text-ink-muted">{p.is_active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.slug}`} className="text-primary hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
