import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sb = await createClient();
  const [orders, products, pendingReturns, subs, lowStock, recent, bySource] = await Promise.all([
    sb.from("orders").select("id", { count: "exact", head: true }),
    sb.from("products").select("id", { count: "exact", head: true }),
    sb.from("return_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("subscribers").select("id", { count: "exact", head: true }),
    sb.from("products").select("name,stock,slug").eq("is_active", true).gt("stock", 0).lte("stock", 5).order("stock"),
    sb.from("orders").select("id,order_number,status,grand_total_inr,created_at").order("created_at", { ascending: false }).limit(8),
    sb.from("orders").select("source,grand_total_inr,status"),
  ]);

  const lowItems = lowStock.data ?? [];
  const PAID = new Set(["paid", "cod_confirmed", "packed", "shipped", "delivered", "fulfilled"]);
  const sourceTotals = new Map<string, { count: number; total: number }>();
  for (const o of (bySource.data ?? []) as any[]) {
    if (!PAID.has(o.status)) continue;
    const k = o.source ?? "website";
    const cur = sourceTotals.get(k) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += Number(o.grand_total_inr);
    sourceTotals.set(k, cur);
  }
  const sourceRows = [...sourceTotals.entries()].sort((a, b) => b[1].total - a[1].total);
  const stats = [
    { label: "Orders", value: orders.count ?? 0, href: "/admin/orders" },
    { label: "Products", value: products.count ?? 0, href: "/admin/products" },
    { label: "Low stock", value: lowItems.length, href: "/admin/products?status=low" },
    { label: "Pending returns", value: pendingReturns.count ?? 0, href: "/admin/returns" },
    { label: "Subscribers", value: subs.count ?? 0, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Dashboard</h1>

      {lowItems.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4">
          <p className="text-sm text-ink">
            <span className="font-medium text-warning">Low stock:</span>{" "}
            {lowItems.slice(0, 6).map((p: any, i: number) => (
              <span key={p.slug}>
                {i > 0 ? ", " : ""}
                <Link href={`/admin/products/${p.slug}`} className="hover:underline">{p.name} ({p.stock})</Link>
              </span>
            ))}
            {lowItems.length > 6 ? ` and ${lowItems.length - 6} more` : ""}.
          </p>
        </div>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-ink-muted/40">
            <p className="text-sm text-ink-muted">{s.label}</p>
            <p className="mt-1 font-heading text-3xl text-ink">{s.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-heading text-xl text-ink">Recent orders</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th></tr>
          </thead>
          <tbody>
            {(recent.data ?? []).map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="text-ink hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3 text-ink-muted">{o.status}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(Number(o.grand_total_inr))}</td>
              </tr>
            ))}
            {(recent.data ?? []).length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-ink-muted">No orders yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {sourceRows.length > 0 ? (
        <>
          <h2 className="mt-10 font-heading text-xl text-ink">Sales by source</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-ink-muted">
                <tr><th className="px-4 py-3">Source</th><th className="px-4 py-3 text-right">Orders</th><th className="px-4 py-3 text-right">Revenue</th></tr>
              </thead>
              <tbody>
                {sourceRows.map(([src, v]) => (
                  <tr key={src} className="border-t border-border">
                    <td className="px-4 py-3 text-ink">
                      <Link href={`/admin/orders?source=${src}`} className="hover:underline">{src}</Link>
                    </td>
                    <td className="px-4 py-3 text-right text-ink-muted">{v.count}</td>
                    <td className="px-4 py-3 text-right text-ink">{formatInr(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
