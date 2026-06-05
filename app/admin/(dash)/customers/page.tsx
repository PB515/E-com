import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const PAID = new Set(["paid", "cod_confirmed", "packed", "shipped", "delivered", "fulfilled"]);

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();

  const sb = await createClient();
  let query = sb
    .from("customers")
    .select("id,name,email,phone,tags,source,created_at, orders(grand_total_inr,created_at,status)");
  if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  const { data } = await query.limit(500);

  const rows = (data ?? [])
    .map((c: any) => {
      const orders = (c.orders ?? []) as { grand_total_inr: number; created_at: string; status: string }[];
      const paid = orders.filter((o) => PAID.has(o.status));
      const ltv = paid.reduce((s, o) => s + Number(o.grand_total_inr), 0);
      const last = orders.map((o) => o.created_at).sort().at(-1);
      return { ...c, count: orders.length, ltv, last };
    })
    .filter((c: any) => c.count > 0 || q)
    .sort((a: any, b: any) => b.ltv - a.ltv);

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Customers</h1>
      <p className="mt-2 text-sm text-ink-muted">
        One profile per buyer (deduped by phone/email). Repeat buyers show their full history.
      </p>

      <form className="mt-6 flex gap-3" method="get">
        <input name="q" defaultValue={q} placeholder="Search name, phone, email…" className="min-w-[220px] flex-1 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink placeholder:text-ink-muted/70" />
        <button type="submit" className="rounded-full border border-border px-5 py-2 text-sm text-ink hover:bg-surface-2">Search</button>
        {q ? <Link href="/admin/customers" className="rounded-full px-4 py-2 text-sm text-ink-muted hover:text-ink">Clear</Link> : null}
      </form>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Lifetime value</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="text-ink hover:underline">{c.name}</Link>
                  <div className="text-xs text-ink-muted">{c.phone}{c.count > 1 ? " · repeat" : ""}</div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{c.source ?? "—"}</td>
                <td className="px-4 py-3 text-right text-ink">{c.count}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(c.ltv)}</td>
                <td className="px-4 py-3 text-ink-muted">{(c.tags ?? []).join(", ")}</td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/customers/${c.id}`} className="text-primary hover:underline">View</Link></td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-muted">No customers yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
