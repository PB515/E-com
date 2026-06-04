import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("products")
    .select("slug,name,category,price_inr,stock,is_active, product_images(url,is_primary)")
    .order("category")
    .order("name");

  function primary(p: any): string | undefined {
    const imgs = p.product_images as { url: string; is_primary: boolean }[] | undefined;
    if (!imgs?.length) return undefined;
    return (imgs.find((i) => i.is_primary) ?? imgs[0]).url;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink">
          + New product
        </Link>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Edit price, stock, HSN, GST rate, story, and image. Stock auto-decrements
        on each sale; at 0 the piece shows sold out on its own.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p: any) => {
              const url = primary(p);
              const soldOut = p.stock <= 0;
              return (
                <tr key={p.slug} className="border-t border-border">
                  <td className="px-4 py-2">
                    <div className="h-10 w-10 overflow-hidden rounded-lg border border-border bg-surface-2">
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatInr(p.price_inr)}</td>
                  <td className="px-4 py-3 text-right text-ink">{p.stock}</td>
                  <td className="px-4 py-3">
                    {!p.is_active ? (
                      <span className="text-ink-muted">Hidden</span>
                    ) : soldOut ? (
                      <span className="text-warning">Sold out</span>
                    ) : (
                      <span className="text-success">Live</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.slug}`} className="text-primary hover:underline">Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
