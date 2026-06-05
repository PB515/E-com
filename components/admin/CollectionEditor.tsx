"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AdminCollection } from "@/lib/collections";
import { updateCollection, uploadCollectionImage } from "@/app/admin/(dash)/collections/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function CollectionEditor({ collection }: { collection: AdminCollection }) {
  const router = useRouter();
  const [f, setF] = useState({
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    seo_title: collection.seoTitle ?? "",
    seo_description: collection.seoDescription ?? "",
    is_active: collection.isActive,
    show_on_home: collection.showOnHome,
    sort_order: String(collection.sortOrder),
  });
  const [imageUrl, setImageUrl] = useState(collection.imageUrl);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));
  const check = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.checked }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (f.slug !== collection.slug && !confirm("Changing the slug changes the collection URL. Old links to the previous URL will break. Continue?")) return;
    setBusy(true); setMsg("");
    const r = await updateCollection(collection.id, {
      title: f.title, slug: f.slug, description: f.description,
      seo_title: f.seo_title, seo_description: f.seo_description,
      is_active: f.is_active, show_on_home: f.show_on_home, sort_order: Number(f.sort_order) || 0,
    });
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setMsg("Saved."); router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg("");
    const fd = new FormData(); fd.set("file", file);
    const r = await uploadCollectionImage(collection.id, fd);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    if ("url" in r && r.url) setImageUrl(r.url);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className={labelClass}>Banner image</p>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-32 overflow-hidden rounded-xl border border-border bg-surface-2">
            {imageUrl ? <Image src={imageUrl} alt={f.title} fill className="object-cover" sizes="128px" /> : <span className="flex h-full items-center justify-center text-xs text-ink-muted">none</span>}
          </div>
          <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-ink hover:bg-surface-2">
            {imageUrl ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={busy} />
          </label>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>Title</label><input value={f.title} onChange={set("title")} className={inputClass} /></div>
        <div><label className={labelClass}>Slug <span className="text-ink-muted">(URL)</span></label><input value={f.slug} onChange={set("slug")} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><textarea value={f.description} onChange={set("description")} rows={2} className={inputClass} /></div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-medium text-ink">Visibility</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.is_active} onChange={check("is_active")} /> Active</label>
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.show_on_home} onChange={check("show_on_home")} /> Show as a homepage rail</label>
          <div className="flex items-center gap-2 text-sm text-ink">Home order <input type="number" value={f.sort_order} onChange={set("sort_order")} className="w-20 rounded-xl border border-border bg-surface-2 px-2 py-1" /></div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>SEO title</label><input value={f.seo_title} onChange={set("seo_title")} className={inputClass} /></div>
        <div><label className={labelClass}>SEO description</label><input value={f.seo_description} onChange={set("seo_description")} className={inputClass} /></div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save collection"}
        </button>
        {msg ? <p className={`text-sm ${msg === "Saved." ? "text-primary" : "text-error"}`} role="status">{msg}</p> : null}
      </div>
    </form>
  );
}
