"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Star } from "@phosphor-icons/react";
import type { CollectionProductLink } from "@/lib/collections";
import { setProductInCollection, setCollectionProductFeatured, moveCollectionProduct } from "@/app/admin/(dash)/collections/actions";

export default function CollectionProducts({
  collectionId,
  products,
}: {
  collectionId: string;
  products: CollectionProductLink[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [q, setQ] = useState("");

  const included = products.filter((p) => p.inCollection);
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  async function toggleIn(p: CollectionProductLink) {
    setBusyId(p.productId);
    await setProductInCollection(collectionId, p.productId, !p.inCollection);
    setBusyId(""); router.refresh();
  }
  async function toggleFeatured(p: CollectionProductLink) {
    setBusyId(p.productId);
    await setCollectionProductFeatured(collectionId, p.productId, !p.isFeatured);
    setBusyId(""); router.refresh();
  }
  async function move(p: CollectionProductLink, dir: "up" | "down") {
    setBusyId(p.productId);
    await moveCollectionProduct(collectionId, p.productId, dir);
    setBusyId(""); router.refresh();
  }

  return (
    <div className="mt-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter products…"
        className="mb-3 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 sm:max-w-xs"
      />
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">In</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Order / featured</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const busy = busyId === p.productId;
              const pos = included.findIndex((x) => x.productId === p.productId);
              return (
                <tr key={p.productId} className={`border-t border-border ${p.inCollection ? "" : "opacity-70"}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={p.inCollection} disabled={busy} onChange={() => toggleIn(p)} />
                  </td>
                  <td className="px-4 py-3 text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.inCollection ? (
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
