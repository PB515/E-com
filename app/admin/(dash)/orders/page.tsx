import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const STATUSES = ["", "paid", "cod_confirmed", "packed", "shipped", "delivered", "fulfilled", "cancelled", "returned"];
const SOURCES = ["", "website", "whatsapp", "instagram", "exhibition", "phone", "marketplace", "manual"];
const PAGE_SIZE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";
  const source = sp.source ?? "";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const sb = await createClient();
  let query = sb
    .from("orders")
    .select("id,order_number,status,source,payment_method,payment_status,grand_total_inr,place_of_supply_state,created_at", { count: "exact" });
  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);
  if (q) query = query.ilike("order_number", `%${q}%`);
  const { data, count } = await query.order("created_at", { ascending: false }).range(from, from + PAGE_SIZE - 1);

  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: number) => {
    const u = new URLSearchParams();
    if (status) u.set("status", status);
    if (source) u.set("source", source);
    if (q) u.set("q", q);
    if (p > 1) u.set("page", String(p));
    const s = u.toString();
    return s ? `?${s}` : "";
  };
  const selectClass = "rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink";

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Orders</h1>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input name="q" defaultValue={q} placeholder="Search order number…" className="min-w-[180px] flex-1 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink placeholder:text-ink-muted/70" />
        <select name="status" defaultValue={status} className={selectClass}>
          {STATUSES.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
        </select>
        <select name="source" defaultValue={source} className={selectClass}>
          {SOURCES.map((s) => <option key={s} value={s}>{s || "All sources"}</option>)}
        </select>
        <button type="submit" className="rounded-full border border-border px-5 py-2 text-sm text-ink hover:bg-surface-2">Filter</button>
        {(q || status || source) ? <Link href="/admin/orders" className="rounded-full px-4 py-2 text-sm text-ink-muted hover:text-ink">Clear</Link> : null}
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="text-ink hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3 text-ink-muted">{o.source}</td>
                <td className="px-4 py-3 text-ink-muted">{o.status}</td>
                <td className="px-4 py-3 text-ink-muted">{o.payment_method}{o.payment_status && o.payment_status !== "paid" ? ` · ${o.payment_status}` : ""}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(Number(o.grand_total_inr))}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No orders match.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
          <span>{total} orders · page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 ? <Link href={`/admin/orders${qs(page - 1)}`} className="rounded-full border border-border px-4 py-2 text-ink hover:bg-surface-2">Previous</Link> : null}
            {page < pages ? <Link href={`/admin/orders${qs(page + 1)}`} className="rounded-full border border-border px-4 py-2 text-ink hover:bg-surface-2">Next</Link> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
