import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";
import CustomerCRM from "@/components/admin/CustomerCRM";

export const dynamic = "force-dynamic";
const PAID = new Set(["paid", "cod_confirmed", "packed", "shipped", "delivered", "fulfilled"]);

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await createClient();
  const { data: c } = await sb.from("customers").select("*").eq("id", id).maybeSingle();
  if (!c) notFound();

  const { data: orders } = await sb
    .from("orders")
    .select("id,order_number,status,source,payment_status,grand_total_inr,created_at")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  const all = orders ?? [];
  const ltv = all.filter((o: any) => PAID.has(o.status)).reduce((s: number, o: any) => s + Number(o.grand_total_inr), 0);
  const phone10 = (c.phone || "").replace(/\D/g, "").slice(-10);
  const wa = phone10 ? `https://wa.me/91${phone10}` : null;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/customers" className="text-sm text-ink-muted hover:text-ink">← Customers</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-ink">{c.name}</h1>
          <p className="text-sm text-ink-muted">{c.phone} · {c.email} · via {c.source ?? "unknown"}</p>
        </div>
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-success/15 px-5 py-2.5 text-sm font-medium text-success hover:bg-success/25">
            WhatsApp
          </a>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Orders</p>
          <p className="font-heading text-2xl text-ink">{all.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Lifetime value</p>
          <p className="font-heading text-2xl text-ink">{formatInr(ltv)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm text-ink-muted">Last order</p>
          <p className="font-heading text-2xl text-ink">{all[0] ? new Date(all[0].created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}</p>
        </div>
      </div>

      <div className="mt-6">
        <CustomerCRM id={c.id} notes={c.notes ?? ""} tags={c.tags ?? []} />
      </div>

      <h2 className="mt-8 font-heading text-xl text-ink">Order history</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Total</th></tr>
          </thead>
          <tbody>
            {all.map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="text-ink hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3 text-ink-muted">{o.source}</td>
                <td className="px-4 py-3 text-ink-muted">{o.status}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(Number(o.grand_total_inr))}</td>
              </tr>
            ))}
            {all.length === 0 ? <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No orders.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
