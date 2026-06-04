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
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <div><label className={labelClass}>Price (₹)</label><input type="number" value={String(f.price_inr)} onChange={set("price_inr")} className={inputClass} /></div>
        <div><label className={labelClass}>Stock</label><input type="number" value={String(f.stock)} onChange={set("stock")} className={inputClass} /></div>
        <div><label className={labelClass}>HSN</label><input value={String(f.hsn_code)} onChange={set("hsn_code")} className={inputClass} /></div>
        <div><label className={labelClass}>GST %</label><input type="number" step="0.01" value={String(f.gst_rate)} onChange={set("gst_rate")} className={inputClass} /></div>
      </div>
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
      <div>
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save product"}
        </button>
      </div>
      {msg ? <p className="text-sm text-primary" role="status">{msg}</p> : null}
    </form>
  );
}
