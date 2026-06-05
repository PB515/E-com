"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { syncInstagramNow } from "@/app/admin/(dash)/instagram/actions";

export default function InstagramSync({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  async function sync() {
    setBusy(true); setMsg(""); setOk(false);
    const r = await syncInstagramNow();
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setOk(true);
    setMsg(`Synced ${r.synced} post${r.synced === 1 ? "" : "s"}${r.skipped ? ` (${r.skipped} skipped)` : ""}.`);
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg text-ink">Auto-sync from Instagram</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm">
            {configured ? (
              <><CheckCircle size={16} weight="fill" className="text-success" /> <span className="text-ink-muted">Connected (token set). Pulls your latest posts and downloads their images.</span></>
            ) : (
              <><WarningCircle size={16} weight="fill" className="text-warning" /> <span className="text-ink-muted">Not connected — set <code className="rounded bg-surface-2 px-1">INSTAGRAM_ACCESS_TOKEN</code> in the environment.</span></>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={sync}
          disabled={busy || !configured}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-50"
        >
          <ArrowsClockwise size={16} className={busy ? "animate-spin" : ""} />
          {busy ? "Syncing…" : "Sync now"}
        </button>
      </div>
      {msg ? <p className={`mt-3 text-sm ${ok ? "text-primary" : "text-error"}`} role="status">{msg}</p> : null}
    </div>
  );
}
