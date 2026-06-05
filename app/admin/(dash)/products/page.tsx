import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr, CATEGORIES } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const STATUSES = [
  { value: "", label: "All" },
  { value: "live", label: "Live" },
  { value: "low", label: "Low stock" },
  { value: "sold", label: "Sold out" },
  { value: "hidden", label: "Hidden" },
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const category = sp.category ?? "";
  const status = sp.status ?? "";

  const sb = await createClient();
  let query = sb
    .from("products")
    .select("slug,name,category,price_inr,stock,is_active, product_images(url,is_primary)");
  if (q) query = query.ilike("name", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (status === "live") query = query.eq("is_active", true).gt("stock", 0);
  else if (status === "low") query = query.eq("is_active", true).gt("stock", 0).lte("stock", 5);
  else if (status === "sold") query = query.eq("is_active", true).lte("stock", 0);
  else if (status === "hidden") query = query.eq("is_active", false);
  const { data } = await query.order("category").order("name");

  function primary(p: any): string | undefined {
    const imgs = p.product_images as { url: string; is_primary: boolean }[] | undefined;
    if (!imgs?.length) return undefined;
    return (imgs.find((i) => i.is_primary) ?? imgs[0]).url;
  }

  const selectClass = "rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-ink">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink">
          + New product
        </Link>
      </div>

      {/* filters (GET form — no JS needed) */}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input name="q" defaultValue={q} placeholder="Search by name…" className="min-w-[180px] flex-1 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink placeholder:text-ink-muted/70" />
        <select name="category" defaultValue={category} className={selectClass}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <select name="status" defaultValue={status} className={selectClass}>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button type="submit" className="rounded-full border border-border px-5 py-2 text-sm text-ink hover:bg-surface-2">Filter</button>
        {(q || category || status) ? (
          <Link href="/admin/products" className="rounded-full px-4 py-2 text-sm text-ink-muted hover:text-ink">Clear</Link>
        ) : null}
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
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
              const low = p.is_active && p.stock > 0 && p.stock <= 5;
              return (
                <tr key={p.slug} className={`border-t border-border ${low ? "bg-warning/5" : ""}`}>
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
                  <td className={`px-4 py-3 text-right ${low ? "text-warning" : "text-ink"}`}>
                    {p.stock}{low ? " ⚠" : ""}
                  </td>
                  <td className="px-4 py-3">
                    {!p.is_active ? <span className="text-ink-muted">Hidden</span>
                      : soldOut ? <span className="text-warning">Sold out</span>
                      : <span className="text-success">Live</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.slug}`} className="text-primary hover:underline">Edit</Link>
                  </td>
                </tr>
              );
            })}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-ink-muted">No products match.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
