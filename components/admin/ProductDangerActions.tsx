"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setStock, deleteProduct } from "@/app/admin/(dash)/products/actions";

export default function ProductDangerActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function soldOut() {
    setBusy(true);
    setMsg("");
    const r = await setStock(slug, 0);
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : "Marked sold out (stock 0).");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    setBusy(true);
    setMsg("");
    const r = await deleteProduct(slug);
    setBusy(false);
    if ("error" in r && r.error) {
      setMsg(r.error);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-heading text-lg text-ink">Quick actions</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={soldOut} disabled={busy} className="rounded-full border border-border px-5 py-2.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-60">
          Mark sold out
        </button>
        <button type="button" onClick={remove} disabled={busy} className="rounded-full border border-error/40 px-5 py-2.5 text-sm text-error hover:bg-error/10 disabled:opacity-60">
          Delete product
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-ink-muted" role="status">{msg}</p> : null}
    </div>
  );
}
