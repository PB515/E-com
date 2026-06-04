import { createClient } from "@/lib/supabase/server";
import ReturnActions from "@/components/admin/ReturnActions";

export const dynamic = "force-dynamic";

export default async function AdminReturnsPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("return_requests")
    .select("id,order_number,reason,note,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Returns</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Approving a return issues a credit note that reverses the GST.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="px-4 py-3 text-ink">{r.order_number}</td>
                <td className="px-4 py-3 text-ink-muted">{r.reason}{r.note ? <span className="block text-xs text-ink-muted/70">{r.note}</span> : null}</td>
                <td className="px-4 py-3 text-ink-muted">{r.status}</td>
                <td className="px-4 py-3 text-right">{r.status === "pending" ? <ReturnActions returnId={r.id} /> : null}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No return requests.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
