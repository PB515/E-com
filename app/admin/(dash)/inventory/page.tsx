import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const LOW_STOCK = 5;

const REASON_LABEL: Record<string, string> = {
  sale: "Sale",
  manual: "Manual order",
  damage: "Damage",
  return: "Return",
  restock: "Restock",
  adjustment: "Adjustment",
};

function when(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const sp = await searchParams;
  const focus = (sp.product ?? "").trim(); // product id to filter the ledger by

  const sb = await createClient();
  const { data: products } = await sb
    .from("products")
    .select("id,name,slug,stock,product_variants(id,label,sku,stock,is_active)")
    .order("name");

  const idToName = new Map<string, string>();
  for (const p of products ?? []) idToName.set(p.id, p.name);

  let mq = sb
    .from("stock_movements")
    .select("id,product_id,variant_id,delta,reason,source,note,actor_email,order_id,created_at")
    .order("created_at", { ascending: false })
    .limit(60);
  if (focus) mq = mq.eq("product_id", focus);
  const { data: movements } = await mq;

  // overview stats
  const all = products ?? [];
  const totalUnits = all.reduce((s, p) => s + Number(p.stock ?? 0), 0);
  const outOfStock = all.filter((p) => Number(p.stock ?? 0) <= 0);
  const lowStock = all.filter((p) => Number(p.stock ?? 0) > 0 && Number(p.stock ?? 0) <= LOW_STOCK);
  const focusName = focus ? idToName.get(focus) : null;

  const cell = "px-4 py-3";

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Inventory</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Stock lives on variants; each product total is their sum. Every change is in the movement log below.
      </p>

      {/* stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-ink-muted">Products</p>
          <p className="mt-1 text-2xl text-ink">{all.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-ink-muted">Units in stock</p>
          <p className="mt-1 text-2xl text-ink">{totalUnits}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-ink-muted">Low stock (≤{LOW_STOCK})</p>
          <p className={`mt-1 text-2xl ${lowStock.length ? "text-warning" : "text-ink"}`}>{lowStock.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-ink-muted">Out of stock</p>
          <p className={`mt-1 text-2xl ${outOfStock.length ? "text-error" : "text-ink"}`}>{outOfStock.length}</p>
        </div>
      </div>

      {/* per-product / per-variant stock */}
      <h2 className="mt-10 font-heading text-xl text-ink">Stock on hand</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className={cell}>Product</th>
              <th className={cell}>Variants</th>
              <th className={`${cell} text-right`}>Total</th>
              <th className={`${cell} text-right`}>Ledger</th>
            </tr>
          </thead>
          <tbody>
            {all.map((p) => {
              const variants = ((p.product_variants ?? []) as any[]).filter((v) => v.is_active);
              const total = Number(p.stock ?? 0);
              const tone = total <= 0 ? "text-error" : total <= LOW_STOCK ? "text-warning" : "text-ink";
              return (
                <tr key={p.id} className="border-t border-border align-top">
                  <td className={cell}>
                    <Link href={`/admin/products/${p.slug}`} className="text-ink hover:underline">{p.name}</Link>
                  </td>
                  <td className={`${cell} text-ink-muted`}>
                    {variants.length === 0 ? (
                      <span className="text-ink-muted/70">no variants</span>
                    ) : (
                      <span className="flex flex-wrap gap-2">
                        {variants.map((v) => (
                          <span key={v.id} className="rounded-full border border-border px-2.5 py-1 text-xs">
                            {v.label}: <span className={Number(v.stock) <= 0 ? "text-error" : Number(v.stock) <= LOW_STOCK ? "text-warning" : "text-ink"}>{v.stock}</span>
                            {v.sku ? <span className="text-ink-muted/60"> · {v.sku}</span> : null}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className={`${cell} text-right ${tone}`}>{total}</td>
                  <td className={`${cell} text-right`}>
                    <Link href={`/admin/inventory?product=${p.id}`} className="text-ink-muted hover:text-ink hover:underline">View</Link>
                  </td>
                </tr>
              );
            })}
            {all.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No products yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* movement ledger */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl text-ink">
          Movement log{focusName ? <span className="text-ink-muted"> · {focusName}</span> : null}
        </h2>
        {focus ? (
          <Link href="/admin/inventory" className="rounded-full px-4 py-2 text-sm text-ink-muted hover:text-ink">Show all</Link>
        ) : null}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className={cell}>When</th>
              <th className={cell}>Product</th>
              <th className={`${cell} text-right`}>Change</th>
              <th className={cell}>Reason</th>
              <th className={cell}>Source</th>
              <th className={cell}>By</th>
            </tr>
          </thead>
          <tbody>
            {(movements ?? []).map((m: any) => {
              const up = Number(m.delta) >= 0;
              return (
                <tr key={m.id} className="border-t border-border">
                  <td className={`${cell} whitespace-nowrap text-ink-muted`}>{when(m.created_at)}</td>
                  <td className={`${cell} text-ink-muted`}>{idToName.get(m.product_id) ?? "—"}</td>
                  <td className={`${cell} text-right tabular-nums ${up ? "text-success" : "text-error"}`}>{up ? "+" : ""}{m.delta}</td>
                  <td className={`${cell} text-ink-muted`}>{REASON_LABEL[m.reason] ?? m.reason}</td>
                  <td className={`${cell} text-ink-muted`}>
                    {m.order_id ? (
                      <Link href={`/admin/orders/${m.order_id}`} className="hover:text-ink hover:underline">{m.source ?? "order"}</Link>
                    ) : (m.source ?? "—")}
                    {m.note ? <span className="text-ink-muted/60"> · {m.note}</span> : null}
                  </td>
                  <td className={`${cell} text-ink-muted`}>{m.actor_email ?? "system"}</td>
                </tr>
              );
            })}
            {(movements ?? []).length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-muted">No stock movements yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
