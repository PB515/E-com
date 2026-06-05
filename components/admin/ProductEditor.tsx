"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProduct, type ProductFields } from "@/app/admin/(dash)/products/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function ProductEditor({ product }: { product: any }) {
  const router = useRouter();
  const [f, setF] = useState<Record<string, string | boolean>>({
    name: product.name,
    price_inr: String(product.price_inr),
    stock: String(product.stock),
    hsn_code: product.hsn_code,
    gst_rate: String(product.gst_rate),
    is_active: product.is_active,
    motif: product.motif ?? "",
    region: product.region ?? "",
    occasion: product.occasion ?? "",
    story: product.story ?? "",
    material: product.material ?? "",
    size: product.size ?? "",
    care: product.care ?? "",
    seo_title: product.seo_title ?? "",
    seo_description: product.seo_description ?? "",
    weight_grams: product.weight_grams != null ? String(product.weight_grams) : "",
    length_cm: product.length_cm != null ? String(product.length_cm) : "",
    breadth_cm: product.breadth_cm != null ? String(product.breadth_cm) : "",
    height_cm: product.height_cm != null ? String(product.height_cm) : "",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fields: ProductFields = {
      name: String(f.name),
      price_inr: Number(f.price_inr),
      stock: Number(f.stock),
      hsn_code: String(f.hsn_code),
      gst_rate: Number(f.gst_rate),
      is_active: Boolean(f.is_active),
      motif: String(f.motif),
      region: String(f.region),
      occasion: String(f.occasion),
      story: String(f.story),
      material: String(f.material),
      size: String(f.size),
      care: String(f.care),
      seo_title: String(f.seo_title),
      seo_description: String(f.seo_description),
      weight_grams: f.weight_grams ? Number(f.weight_grams) : null,
      length_cm: f.length_cm ? Number(f.length_cm) : null,
      breadth_cm: f.breadth_cm ? Number(f.breadth_cm) : null,
      height_cm: f.height_cm ? Number(f.height_cm) : null,
    };
    const r = await updateProduct(product.slug, fields);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setMsg("Saved.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-2xl flex-col gap-5">
      <div>
        <label className={labelClass}>Name</label>
        <input value={String(f.name)} onChange={set("name")} className={inputClass} />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div><label className={labelClass}>Price (₹)</label><input type="number" value={String(f.price_inr)} onChange={set("price_inr")} className={inputClass} /></div>
        <div><label className={labelClass}>HSN</label><input value={String(f.hsn_code)} onChange={set("hsn_code")} className={inputClass} /></div>
        <div><label className={labelClass}>GST %</label><input type="number" step="0.01" value={String(f.gst_rate)} onChange={set("gst_rate")} className={inputClass} /></div>
      </div>
      <p className="-mt-2 text-xs text-ink-muted">Stock is managed per variant in the Variants section above.</p>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input type="checkbox" checked={Boolean(f.is_active)} onChange={(e) => setF((s) => ({ ...s, is_active: e.target.checked }))} />
        Active (visible in the shop)
      </label>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div><label className={labelClass}>Motif</label><input value={String(f.motif)} onChange={set("motif")} className={inputClass} /></div>
        <div><label className={labelClass}>Region</label><input value={String(f.region)} onChange={set("region")} className={inputClass} /></div>
        <div><label className={labelClass}>Occasion</label><input value={String(f.occasion)} onChange={set("occasion")} className={inputClass} /></div>
      </div>
      <div>
        <label className={labelClass}>Heritage story</label>
        <textarea rows={4} value={String(f.story)} onChange={set("story")} className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div><label className={labelClass}>Material</label><input value={String(f.material)} onChange={set("material")} className={inputClass} /></div>
        <div><label className={labelClass}>Size</label><input value={String(f.size)} onChange={set("size")} className={inputClass} /></div>
        <div><label className={labelClass}>Care</label><input value={String(f.care)} onChange={set("care")} className={inputClass} /></div>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="font-heading text-lg text-ink">Shipping (used by Shiprocket)</h3>
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div><label className={labelClass}>Weight (g)</label><input type="number" value={String(f.weight_grams)} onChange={set("weight_grams")} className={inputClass} /></div>
          <div><label className={labelClass}>Length (cm)</label><input type="number" value={String(f.length_cm)} onChange={set("length_cm")} className={inputClass} /></div>
          <div><label className={labelClass}>Breadth (cm)</label><input type="number" value={String(f.breadth_cm)} onChange={set("breadth_cm")} className={inputClass} /></div>
          <div><label className={labelClass}>Height (cm)</label><input type="number" value={String(f.height_cm)} onChange={set("height_cm")} className={inputClass} /></div>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h3 className="font-heading text-lg text-ink">SEO</h3>
        <div className="mt-4 flex flex-col gap-5">
          <div><label className={labelClass}>SEO title <span className="text-ink-muted">(defaults to the product name)</span></label><input value={String(f.seo_title)} onChange={set("seo_title")} className={inputClass} placeholder={String(f.name)} /></div>
          <div><label className={labelClass}>SEO meta description</label><textarea rows={2} value={String(f.seo_description)} onChange={set("seo_description")} className={inputClass} placeholder="155 characters, shown in search results" /></div>
        </div>
      </div>

      <div>
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save product"}
        </button>
      </div>
      {msg ? <p className="text-sm text-primary" role="status">{msg}</p> : null}
    </form>
  );
}
