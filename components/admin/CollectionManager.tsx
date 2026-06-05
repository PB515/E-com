"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Trash, Plus } from "@phosphor-icons/react";
import type { AdminCollection } from "@/lib/collections";
import { createCollection, toggleCollectionFlag, moveCollection, deleteCollection } from "@/app/admin/(dash)/collections/actions";

function Pill({ on, label, onClick, busy }: { on: boolean; label: string; onClick: () => void; busy: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={busy}
      className={`rounded-full border px-3 py-1 text-xs transition-colors disabled:opacity-50 ${on ? "border-success/40 bg-success/15 text-success" : "border-border text-ink-muted hover:text-ink"}`}>
      {label}
    </button>
  );
}

export default function CollectionManager({ initial }: { initial: AdminCollection[] }) {
  const router = useRouter();
  const [rows] = useState(initial);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [busyId, setBusyId] = useState("");
  const [msg, setMsg] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusyId("new"); setMsg("");
    const r = await createCollection({ title, slug });
    setBusyId("");
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setTitle(""); setSlug(""); router.refresh();
  }
  async function flag(c: AdminCollection, key: "is_active" | "show_on_home", value: boolean) {
    setBusyId(c.id); await toggleCollectionFlag(c.id, key, value); setBusyId(""); router.refresh();
  }
  async function move(c: AdminCollection, dir: "up" | "down") {
    setBusyId(c.id); await moveCollection(c.id, dir); setBusyId(""); router.refresh();
  }
  async function remove(c: AdminCollection) {
    if (!confirm(`Delete the "${c.title}" collection? Products stay; only the grouping is removed.`)) return;
    setBusyId(c.id); setMsg("");
    const r = await deleteCollection(c.id);
    setBusyId("");
    if ("error" in r && r.error) { setMsg(r.error); return; }
    router.refresh();
  }

  const inputClass = "rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70";

  return (
    <div className="mt-6">
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
        <div>
          <label className="mb-1 block text-xs text-ink-muted">New collection title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Festive Picks" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-muted">Slug (optional)</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" className={inputClass} />
        </div>
        <button type="submit" disabled={busyId === "new" || !title.trim()} className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          <Plus size={15} /> Add
        </button>
      </form>
      {msg ? <p className="mt-3 text-sm text-error" role="alert">{msg}</p> : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => {
              const busy = busyId === c.id;
              return (
                <tr key={c.id} className="border-t border-border align-middle">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => move(c, "up")} disabled={busy || i === 0} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => move(c, "down")} disabled={busy || i === rows.length - 1} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowDown size={14} /></button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/collections/${c.id}`} className="text-ink hover:underline">{c.title}</Link>
                    <span className="block text-xs text-ink-muted">/{c.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{c.productCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Pill on={c.isActive} label={c.isActive ? "Active" : "Hidden"} busy={busy} onClick={() => flag(c, "is_active", !c.isActive)} />
                      <Pill on={c.showOnHome} label="Home" busy={busy} onClick={() => flag(c, "show_on_home", !c.showOnHome)} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/collections/${c.id}`} className="text-ink-muted hover:text-ink">Edit</Link>
                      <button type="button" onClick={() => remove(c)} disabled={busy} className="text-error/80 hover:text-error disabled:opacity-30"><Trash size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No collections yet. Add one above.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
