import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("invoices")
    .select("invoice_number,order_id,is_intra_state,total_tax_amount,grand_total_inr,issued_at")
    .order("issued_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Invoices</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Generated from each order's tax snapshot at the time of sale. Past
        invoices never change when a rate is edited.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Split</th>
              <th className="px-4 py-3 text-right">Tax</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((v: any) => (
              <tr key={v.invoice_number} className="border-t border-border">
                <td className="px-4 py-3 text-ink">{v.invoice_number}</td>
                <td className="px-4 py-3 text-ink-muted">{v.is_intra_state ? "CGST + SGST" : "IGST"}</td>
                <td className="px-4 py-3 text-right text-ink-muted">{formatInr(Number(v.total_tax_amount))}</td>
                <td className="px-4 py-3 text-right text-ink">{formatInr(Number(v.grand_total_inr))}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No invoices yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
