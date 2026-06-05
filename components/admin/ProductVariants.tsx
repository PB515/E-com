"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react";
import { addVariant, updateVariant, deleteVariant, adjustVariantStock } from "@/app/admin/(dash)/products/actions";

interface V { id: string; label: string; sku: string | null; price_inr: number | null; stock: number; is_active: boolean }
const ic = "rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink";

export default function ProductVariants({ slug, productId, variants }: { slug: string; productId: string; variants: V[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [neu, setNeu] = useState({ label: "", sku: "", price: "", stock: "0" });

  async function run(fn: () => Promise<any>) {
    setBusy(true);
    await fn();
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-ink-muted">
            <tr><th className="py-2 pr-3">Variant</th><th className="py-2 pr-3">SKU</th><th className="py-2 pr-3">Price ₹</th><th className="py-2 pr-3">Stock</th><th className="py-2 pr-3">Active</th><th className="py-2 pr-3">Adjust stock</th><th></th></tr>
          </thead>
          <tbody>
            {variants.map((v) => <VariantRow key={v.id} v={v} slug={slug} productId={productId} busy={busy} run={run} />)}
            {variants.length === 0 ? <tr><td colSpan={7} className="py-3 text-ink-muted">No variants yet. Add one below.</td></tr> : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-border pt-4">
        <div><label className="mb-1 block text-xs text-ink-muted">Label</label><input value={neu.label} onChange={(e)=>setNeu({...neu,label:e.target.value})} placeholder="e.g. Size 6" className={ic} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">SKU</label><input value={neu.sku} onChange={(e)=>setNeu({...neu,sku:e.target.value})} className={ic} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">Price ₹ (blank = inherit)</label><input type="number" value={neu.price} onChange={(e)=>setNeu({...neu,price:e.target.value})} className={`${ic} w-28`} /></div>
        <div><label className="mb-1 block text-xs text-ink-muted">Stock</label><input type="number" value={neu.stock} onChange={(e)=>setNeu({...neu,stock:e.target.value})} className={`${ic} w-20`} /></div>
        <button type="button" disabled={busy} onClick={()=>run(async()=>{ await addVariant(slug, productId, { label: neu.label, sku: neu.sku, price_inr: neu.price ? Number(neu.price) : null, stock: Number(neu.stock||0) }); setNeu({label:"",sku:"",price:"",stock:"0"}); })} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">Add variant</button>
      </div>
    </div>
  );
}

function VariantRow({ v, slug, productId, busy, run }: { v: V; slug: string; productId: string; busy: boolean; run: (fn: () => Promise<any>) => void }) {
  const [label, setLabel] = useState(v.label);
  const [sku, setSku] = useState(v.sku ?? "");
  const [price, setPrice] = useState(v.price_inr != null ? String(v.price_inr) : "");
  const [active, setActive] = useState(v.is_active);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("restock");

  return (
    <tr className="border-t border-border align-middle">
      <td className="py-2 pr-3"><input value={label} onChange={(e)=>setLabel(e.target.value)} className={`${ic} w-28`} /></td>
      <td className="py-2 pr-3"><input value={sku} onChange={(e)=>setSku(e.target.value)} className={`${ic} w-24`} /></td>
      <td className="py-2 pr-3"><input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="inherit" className={`${ic} w-24`} /></td>
      <td className="py-2 pr-3 text-ink">{v.stock}</td>
      <td className="py-2 pr-3"><input type="checkbox" checked={active} onChange={(e)=>setActive(e.target.checked)} /></td>
      <td className="py-2 pr-3">
        <div className="flex items-center gap-1">
          <input type="number" value={delta} onChange={(e)=>setDelta(e.target.value)} placeholder="±qty" className={`${ic} w-16`} />
          <select value={reason} onChange={(e)=>setReason(e.target.value)} className={ic}>{["restock","manual","damage","return","adjustment"].map((r)=><option key={r}>{r}</option>)}</select>
          <button type="button" disabled={busy || !delta} onClick={()=>run(async()=>{ await adjustVariantStock(v.id, slug, productId, Number(delta), reason, ""); setDelta(""); })} className="rounded-full border border-border px-3 py-2 text-xs text-ink hover:bg-surface-2">Apply</button>
        </div>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-2">
          <button type="button" disabled={busy} onClick={()=>run(()=>updateVariant(v.id, slug, productId, { label, sku, price_inr: price ? Number(price) : null, is_active: active }))} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-ink">Save</button>
          <button type="button" disabled={busy} onClick={()=>run(()=>deleteVariant(v.id, slug, productId))} className="p-1 text-error"><Trash size={14} /></button>
        </div>
      </td>
    </tr>
  );
}
