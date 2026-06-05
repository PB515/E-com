"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash, Plus } from "@phosphor-icons/react";
import { formatInr } from "@/lib/catalog";
import { createManualOrder } from "@/app/admin/(dash)/orders/create/actions";

interface Variant { id: string; label: string; price_inr: number | null; stock: number }
interface Prod { id: string; name: string; price_inr: number; variants: Variant[] }
interface Line { productId: string; variantId: string; qty: number; unitPriceInr: number }

const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"];
const SOURCES = ["whatsapp","instagram","exhibition","phone","marketplace","manual","other"];
const ic = "w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink";
const lc = "mb-1 block text-xs text-ink-muted";

export default function ManualOrderForm({ catalog }: { catalog: Prod[] }) {
  const router = useRouter();
  const [cust, setCust] = useState({ name: "", phone: "", email: "" });
  const [addr, setAddr] = useState({ line1: "", line2: "", city: "", state: "", pincode: "" });
  const [lines, setLines] = useState<Line[]>([{ productId: "", variantId: "", qty: 1, unitPriceInr: 0 }]);
  const [discount, setDiscount] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [source, setSource] = useState("whatsapp");
  const [mkt, setMkt] = useState({ name: "", orderId: "", fee: "0" });
  const [note, setNote] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

  function setLine(i: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }
  function pickProduct(i: number, productId: string) {
    const p = byId.get(productId);
    const v = p?.variants[0];
    setLine(i, { productId, variantId: v?.id ?? "", unitPriceInr: v?.price_inr ?? p?.price_inr ?? 0 });
  }
  function pickVariant(i: number, variantId: string) {
    const l = lines[i];
    const p = byId.get(l.productId);
    const v = p?.variants.find((x) => x.id === variantId);
    setLine(i, { variantId, unitPriceInr: v?.price_inr ?? p?.price_inr ?? 0 });
  }

  const subtotal = lines.reduce((s, l) => s + (l.unitPriceInr || 0) * (l.qty || 0), 0);
  const total = Math.max(0, subtotal - Number(discount || 0)) + Number(shipping || 0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await createManualOrder({
      customer: cust, address: addr,
      items: lines.filter((l) => l.productId && l.variantId && l.qty > 0),
      discountInr: Number(discount || 0), shippingInr: Number(shipping || 0),
      paymentMethod: paymentMethod as any, paymentStatus: paymentStatus as any, source,
      marketplaceName: source === "marketplace" ? mkt.name : undefined,
      marketplaceOrderId: source === "marketplace" ? mkt.orderId : undefined,
      marketplaceFeeInr: source === "marketplace" ? Number(mkt.fee || 0) : undefined,
      internalNote: note, isDraft,
    });
    setBusy(false);
    if ("error" in r && r.error) { setErr(r.error); return; }
    if ("ok" in r && r.ok) { router.push(`/admin/orders/${r.orderId}`); router.refresh(); }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-heading text-lg text-ink">Customer</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><label className={lc}>Name *</label><input required value={cust.name} onChange={(e)=>setCust({...cust,name:e.target.value})} className={ic} /></div>
            <div><label className={lc}>Phone *</label><input required value={cust.phone} onChange={(e)=>setCust({...cust,phone:e.target.value})} className={ic} /></div>
            <div><label className={lc}>Email</label><input value={cust.email} onChange={(e)=>setCust({...cust,email:e.target.value})} className={ic} /></div>
          </div>
          <p className="mt-2 text-xs text-ink-muted">Existing customers are matched by phone/email automatically.</p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-heading text-lg text-ink">Delivery address</h2>
          <div className="mt-3 grid gap-3">
            <div><label className={lc}>Address</label><input value={addr.line1} onChange={(e)=>setAddr({...addr,line1:e.target.value})} className={ic} /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className={lc}>City</label><input value={addr.city} onChange={(e)=>setAddr({...addr,city:e.target.value})} className={ic} /></div>
              <div><label className={lc}>PIN</label><input value={addr.pincode} onChange={(e)=>setAddr({...addr,pincode:e.target.value})} className={ic} /></div>
              <div><label className={lc}>State *</label>
                <select required value={addr.state} onChange={(e)=>setAddr({...addr,state:e.target.value})} className={ic}>
                  <option value="" disabled>Select</option>{STATES.map((s)=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-heading text-lg text-ink">Items</h2>
          <div className="mt-3 flex flex-col gap-3">
            {lines.map((l, i) => {
              const p = byId.get(l.productId);
              return (
                <div key={i} className="grid grid-cols-[1.4fr_1fr_56px_80px_32px] items-end gap-2">
                  <div><label className={lc}>Product</label>
                    <select value={l.productId} onChange={(e)=>pickProduct(i,e.target.value)} className={ic}>
                      <option value="">Select…</option>{catalog.map((pp)=><option key={pp.id} value={pp.id}>{pp.name}</option>)}
                    </select>
                  </div>
                  <div><label className={lc}>Variant</label>
                    <select value={l.variantId} onChange={(e)=>pickVariant(i,e.target.value)} className={ic} disabled={!p}>
                      {(p?.variants ?? []).map((v)=><option key={v.id} value={v.id}>{v.label} ({v.stock})</option>)}
                    </select>
                  </div>
                  <div><label className={lc}>Qty</label><input type="number" min={1} value={l.qty} onChange={(e)=>setLine(i,{qty:Number(e.target.value)})} className={ic} /></div>
                  <div><label className={lc}>Price ₹</label><input type="number" value={l.unitPriceInr} onChange={(e)=>setLine(i,{unitPriceInr:Number(e.target.value)})} className={ic} /></div>
                  <button type="button" onClick={()=>setLines((ls)=>ls.filter((_,j)=>j!==i))} className="mb-1 p-2 text-error"><Trash size={16} /></button>
                </div>
              );
            })}
            <button type="button" onClick={()=>setLines((ls)=>[...ls,{productId:"",variantId:"",qty:1,unitPriceInr:0}])} className="flex items-center gap-1 self-start text-sm text-primary"><Plus size={14}/> Add item</button>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-lg text-ink">Order</h2>
        <div className="mt-3 grid gap-3">
          <div><label className={lc}>Source</label>
            <select value={source} onChange={(e)=>setSource(e.target.value)} className={ic}>{SOURCES.map((s)=><option key={s}>{s}</option>)}</select>
          </div>
          {source === "marketplace" ? (
            <div className="grid gap-2 rounded-xl border border-border p-2">
              <input placeholder="Marketplace (Amazon/Meesho)" value={mkt.name} onChange={(e)=>setMkt({...mkt,name:e.target.value})} className={ic} />
              <input placeholder="Marketplace order ID" value={mkt.orderId} onChange={(e)=>setMkt({...mkt,orderId:e.target.value})} className={ic} />
              <input type="number" placeholder="Marketplace fee ₹" value={mkt.fee} onChange={(e)=>setMkt({...mkt,fee:e.target.value})} className={ic} />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lc}>Payment</label>
              <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className={ic}>{["upi","cod","cash","bank","marketplace"].map((s)=><option key={s}>{s}</option>)}</select>
            </div>
            <div><label className={lc}>Status</label>
              <select value={paymentStatus} onChange={(e)=>setPaymentStatus(e.target.value)} className={ic}>{["paid","pending","partial"].map((s)=><option key={s}>{s}</option>)}</select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lc}>Discount ₹</label><input type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} className={ic} /></div>
            <div><label className={lc}>Shipping ₹</label><input type="number" value={shipping} onChange={(e)=>setShipping(e.target.value)} className={ic} /></div>
          </div>
          <div><label className={lc}>Internal note</label><textarea rows={2} value={note} onChange={(e)=>setNote(e.target.value)} className={ic} placeholder="Wants delivery before Friday" /></div>
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={isDraft} onChange={(e)=>setIsDraft(e.target.checked)} /> Save as draft (no stock deduction yet)</label>
        </div>

        <dl className="mt-4 flex flex-col gap-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-ink-muted"><dt>Subtotal</dt><dd>{formatInr(subtotal)}</dd></div>
          <div className="flex justify-between text-ink-muted"><dt>Discount</dt><dd>- {formatInr(Number(discount||0))}</dd></div>
          <div className="flex justify-between text-ink-muted"><dt>Shipping</dt><dd>{formatInr(Number(shipping||0))}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 text-ink"><dt className="font-medium">Total (incl. GST)</dt><dd className="font-medium">{formatInr(total)}</dd></div>
        </dl>
        {err ? <p className="mt-3 text-sm text-error" role="alert">{err}</p> : null}
        <button type="submit" disabled={busy} className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Creating…" : isDraft ? "Save draft" : "Create order"}
        </button>
      </aside>
    </form>
  );
}
