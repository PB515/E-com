"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/admin/(dash)/products/actions";

export default function ProductDangerActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

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
      <h2 className="font-heading text-lg text-ink">Danger zone</h2>
      <p className="mt-1 text-sm text-ink-muted">To sell out, set the variant stock to 0 above. To hide, untick Active.</p>
      <div className="mt-4">
        <button type="button" onClick={remove} disabled={busy} className="rounded-full border border-error/40 px-5 py-2.5 text-sm text-error hover:bg-error/10 disabled:opacity-60">
          Delete product
        </button>
      </div>
      {msg ? <p className="mt-3 text-sm text-ink-muted" role="status">{msg}</p> : null}
    </div>
  );
}
