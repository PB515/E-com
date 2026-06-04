"use client";

import { useState } from "react";
import { approveReturn, rejectReturn } from "@/app/admin/(dash)/returns/actions";

export default function ReturnActions({ returnId }: { returnId: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  async function approve() {
    setBusy(true);
    const r = await approveReturn(returnId);
    setBusy(false);
    setDone("error" in r && r.error ? r.error : "Approved, credit note issued");
  }
  async function reject() {
    setBusy(true);
    const r = await rejectReturn(returnId);
    setBusy(false);
    setDone("error" in r && r.error ? r.error : "Rejected");
  }

  if (done) return <span className="text-sm text-ink-muted">{done}</span>;
  return (
    <div className="flex gap-2">
      <button type="button" onClick={approve} disabled={busy} className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-ink hover:bg-ink disabled:opacity-60">Approve</button>
      <button type="button" onClick={reject} disabled={busy} className="rounded-full border border-border px-4 py-2 text-xs text-ink-muted hover:text-ink">Reject</button>
    </div>
  );
}
