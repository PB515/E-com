import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const sb = await createClient();
  const { data } = await sb
    .from("admin_audit")
    .select("actor_email,action,entity,entity_id,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Activity log</h1>
      <p className="mt-2 text-sm text-ink-muted">Recent admin actions (last 200).</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Item</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any, i: number) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-3 text-ink-muted">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-ink-muted">{r.actor_email ?? "—"}</td>
                <td className="px-4 py-3 text-ink">{r.action}</td>
                <td className="px-4 py-3 text-ink-muted">{r.entity}{r.entity_id ? ` · ${r.entity_id}` : ""}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No activity yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
