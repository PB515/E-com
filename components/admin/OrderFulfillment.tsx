"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, pushToShiprocket } from "@/app/admin/(dash)/orders/actions";

const STEPS = ["paid", "packed", "shipped", "delivered"];

export default function OrderFulfillment({
  orderId,
  status,
  tracking,
  courier,
  shipmentId,
}: {
  orderId: string;
  status: string;
  tracking?: string | null;
  courier?: string | null;
  shipmentId?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [trk, setTrk] = useState(tracking ?? "");
  const [crr, setCrr] = useState(courier ?? "");

  const norm = status === "cod_confirmed" ? "paid" : status;
  const idx = STEPS.indexOf(norm);

  async function go(next: "packed" | "shipped" | "delivered", withTracking = false) {
    setBusy(true);
    setMsg("");
    const r = await updateOrderStatus(orderId, next, withTracking ? { tracking: trk, courier: crr } : undefined);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    router.refresh();
  }

  async function ship() {
    setBusy(true);
    setMsg("");
    const r = await pushToShiprocket(orderId);
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : `Pushed to Shiprocket (shipment ${("shipmentId" in r && r.shipmentId) || "created"}).`);
    router.refresh();
  }

  const btn = "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60";
  const ghost = "rounded-full border border-border px-4 py-2 text-sm text-ink hover:bg-surface-2 disabled:opacity-60";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-heading text-lg text-ink">Fulfillment</h2>

      {/* pipeline */}
      <ol className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {STEPS.map((s, i) => (
          <li key={s} className={`rounded-full px-3 py-1 ${i <= idx ? "bg-primary text-primary-ink" : "border border-border text-ink-muted"}`}>
            {s}
          </li>
        ))}
      </ol>

      {tracking ? (
        <p className="mt-3 text-sm text-ink-muted">Tracking: <span className="text-ink">{tracking}</span>{courier ? ` · ${courier}` : ""}</p>
      ) : null}
      {shipmentId ? <p className="text-sm text-ink-muted">Shiprocket shipment: {shipmentId}</p> : null}

      <div className="mt-4 flex flex-col gap-3">
        {(norm === "paid") ? (
          <button type="button" onClick={() => go("packed")} disabled={busy} className={btn}>Mark packed</button>
        ) : null}

        {(norm === "packed") ? (
          <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={trk} onChange={(e) => setTrk(e.target.value)} placeholder="Tracking / AWB number" className="rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink" />
              <input value={crr} onChange={(e) => setCrr(e.target.value)} placeholder="Courier (e.g. Delhivery)" className="rounded-full border border-border bg-surface-2 px-4 py-2 text-sm text-ink" />
            </div>
            <button type="button" onClick={() => go("shipped", true)} disabled={busy} className={btn}>Mark shipped</button>
          </div>
        ) : null}

        {(norm === "shipped") ? (
          <button type="button" onClick={() => go("delivered")} disabled={busy} className={btn}>Mark delivered</button>
        ) : null}

        {(norm === "paid" || norm === "packed") ? (
          <button type="button" onClick={ship} disabled={busy} className={ghost}>Push to Shiprocket</button>
        ) : null}
      </div>

      {msg ? <p className="mt-3 text-sm text-ink-muted" role="status">{msg}</p> : null}
    </div>
  );
}
