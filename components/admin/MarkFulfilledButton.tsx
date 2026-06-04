"use client";

import { useState } from "react";
import { markFulfilled } from "@/app/admin/(dash)/orders/actions";

export default function MarkFulfilledButton({ orderId }: { orderId: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function go() {
    setBusy(true);
    const r = await markFulfilled(orderId);
    setBusy(false);
    if (!("error" in r)) setDone(true);
  }
  if (done) return <span className="text-sm text-success">Marked fulfilled</span>;
  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60"
    >
      {busy ? "Updating…" : "Mark fulfilled"}
    </button>
  );
}
