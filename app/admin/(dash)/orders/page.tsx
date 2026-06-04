import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("orders")
    .select("id,order_number,status,payment_method,grand_total_inr,place_of_supply_state,created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Orders</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3"><Link href={`/admin/orders/${o.id}`} className="text-ink hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-3 text-ink-muted">{o.status}</td>
                <td className="px-4 py-3 text-ink-muted">{o.payment_method}</td>
                <td className="px-4 py-3 text-ink-muted">{o.place_of_supply_state}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(Number(o.grand_total_inr))}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No orders yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
