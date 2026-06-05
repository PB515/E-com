"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/admin/(dash)/products/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function NewProductForm({
  categories = [],
}: {
  categories?: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [f, setF] = useState({
    name: "", slug: "", category: categories[0]?.slug ?? "",
    price_inr: "499", stock: "10", hsn_code: "7117", gst_rate: "12",
    is_active: true, featured: false,
    motif: "", region: "", occasion: "", story: "",
    material: "German silver, oxidised finish", size: "", care: "Keep dry. Wipe with a soft cloth.",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const r = await createProduct({
      name: f.name, slug: f.slug, category: f.category,
      price_inr: Number(f.price_inr), stock: Number(f.stock),
      hsn_code: f.hsn_code, gst_rate: Number(f.gst_rate),
      is_active: f.is_active, featured: f.featured,
      motif: f.motif, region: f.region, occasion: f.occasion, story: f.story,
      material: f.material, size: f.size, care: f.care,
      seo_title: "", seo_description: "",
      weight_grams: null, length_cm: null, breadth_cm: null, height_cm: null,
    });
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    if ("ok" in r && r.ok) {
      router.push(`/admin/products/${r.slug}`); // go to editor to add an image
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>Name</label><input required value={f.name} onChange={set("name")} className={inputClass} placeholder="Oxidised Jhumka" /></div>
        <div><label className={labelClass}>Slug <span className="text-ink-muted">(optional, from name)</span></label><input value={f.slug} onChange={set("slug")} className={inputClass} placeholder="oxidised-jhumka" /></div>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div>
          <label className={labelClass}>Category</label>
          <select value={f.category} onChange={set("category")} className={inputClass}>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div><label className={labelClass}>Price (₹)</label><input type="number" required value={f.price_inr} onChange={set("price_inr")} className={inputClass} /></div>
        <div><label className={labelClass}>Stock</label><input type="number" required value={f.stock} onChange={set("stock")} className={inputClass} /></div>
        <div><label className={labelClass}>GST %</label><input type="number" step="0.01" value={f.gst_rate} onChange={set("gst_rate")} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div><label className={labelClass}>HSN</label><input value={f.hsn_code} onChange={set("hsn_code")} className={inputClass} /></div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.is_active} onChange={(e) => setF((s) => ({ ...s, is_active: e.target.checked }))} /> Active</label>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.featured} onChange={(e) => setF((s) => ({ ...s, featured: e.target.checked }))} /> Featured on home</label>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div><label className={labelClass}>Motif</label><input value={f.motif} onChange={set("motif")} className={inputClass} /></div>
        <div><label className={labelClass}>Region</label><input value={f.region} onChange={set("region")} className={inputClass} /></div>
        <div><label className={labelClass}>Occasion</label><input value={f.occasion} onChange={set("occasion")} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Heritage story</label><textarea rows={3} value={f.story} onChange={set("story")} className={inputClass} /></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div><label className={labelClass}>Material</label><input value={f.material} onChange={set("material")} className={inputClass} /></div>
        <div><label className={labelClass}>Size</label><input value={f.size} onChange={set("size")} className={inputClass} /></div>
        <div><label className={labelClass}>Care</label><input value={f.care} onChange={set("care")} className={inputClass} /></div>
      </div>
      <div>
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Creating…" : "Create product"}
        </button>
        <p className="mt-2 text-xs text-ink-muted">After creating, you can upload the product image on the edit page.</p>
      </div>
      {msg ? <p className="text-sm text-error" role="alert">{msg}</p> : null}
    </form>
  );
}
