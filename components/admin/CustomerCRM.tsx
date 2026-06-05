"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCustomerCRM } from "@/app/admin/(dash)/customers/actions";

const SUGGESTED = ["repeat buyer", "COD buyer", "high value", "return risk", "wholesale"];

export default function CustomerCRM({
  id,
  notes,
  tags,
}: {
  id: string;
  notes: string;
  tags: string[];
}) {
  const router = useRouter();
  const [n, setN] = useState(notes);
  const [t, setT] = useState(tags.join(", "));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setBusy(true);
    setMsg("");
    const r = await updateCustomerCRM(id, {
      notes: n,
      tags: t.split(",").map((x) => x.trim()).filter(Boolean),
    });
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : "Saved.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-heading text-lg text-ink">Notes & tags</h2>
      <label className="mt-4 block text-sm text-ink">Internal notes</label>
      <textarea
        rows={3}
        value={n}
        onChange={(e) => setN(e.target.value)}
        placeholder="Prefers COD · asked for lightweight pieces · liked oxidised earrings"
        className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink"
      />
      <label className="mt-4 block text-sm text-ink">Tags (comma-separated)</label>
      <input
        value={t}
        onChange={(e) => setT(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setT((cur) => (cur ? `${cur}, ${s}` : s))}
            className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted hover:text-ink"
          >
            + {s}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
        {msg ? <span className="text-sm text-ink-muted">{msg}</span> : null}
      </div>
    </div>
  );
}
