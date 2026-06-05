"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Star } from "@phosphor-icons/react";
import type { CategoryProductLink } from "@/lib/categories";
import { setProductInCategory, setCategoryProductFeatured, moveCategoryProduct } from "@/app/admin/(dash)/categories/actions";

export default function CategoryProducts({
  categoryId,
  products,
}: {
  categoryId: string;
  products: CategoryProductLink[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");

  const included = products.filter((p) => p.inCategory);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  async function toggleIn(p: CategoryProductLink) {
    setBusyId(p.productId); setMsg("");
    const r = await setProductInCategory(categoryId, p.productId, !p.inCategory);
    setBusyId("");
    if ("error" in r && r.error) { setMsg(r.error); return; }
    router.refresh();
  }
  async function toggleFeatured(p: CategoryProductLink) {
    setBusyId(p.productId);
    await setCategoryProductFeatured(categoryId, p.productId, !p.isFeatured);
    setBusyId(""); router.refresh();
  }
  async function move(p: CategoryProductLink, dir: "up" | "down") {
    setBusyId(p.productId);
    await moveCategoryProduct(categoryId, p.productId, dir);
    setBusyId(""); router.refresh();
  }

  return (
    <div className="mt-4">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter products…"
        className="mb-3 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 sm:max-w-xs" />
      {msg ? <p className="mb-3 text-sm text-error" role="alert">{msg}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">In</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Primary</th>
              <th className="px-4 py-3 text-right">Order / featured</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const busy = busyId === p.productId;
              const pos = included.findIndex((x) => x.productId === p.productId);
              return (
                <tr key={p.productId} className={`border-t border-border ${p.inCategory ? "" : "opacity-70"}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={p.inCategory} disabled={busy || p.isPrimary} title={p.isPrimary ? "Primary category — can't remove here" : undefined} onChange={() => toggleIn(p)} />
                  </td>
                  <td className="px-4 py-3 text-ink">{p.name}{p.isPrimary ? <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted">primary</span> : null}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.primaryCategory}</td>
                  <td className="px-4 py-3">
                    {p.inCategory ? (
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => toggleFeatured(p)} disabled={busy} title="Pin to front" className={p.isFeatured ? "text-warning" : "text-ink-muted hover:text-ink"}>
                          <Star size={16} weight={p.isFeatured ? "fill" : "regular"} />
                        </button>
                        <button type="button" onClick={() => move(p, "up")} disabled={busy || pos <= 0} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowUp size={15} /></button>
                        <button type="button" onClick={() => move(p, "down")} disabled={busy || pos === included.length - 1} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowDown size={15} /></button>
                      </div>
                    ) : (
                      <span className="block text-right text-ink-muted/50">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted">No products match.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
