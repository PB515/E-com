"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { formatInr } from "@/lib/catalog";
import { computeGstFromInclusive, gstIncludedInTotal } from "@/lib/tax";
import { placeOrder } from "@/app/(storefront)/checkout/actions";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function CheckoutClient({
  sellerState,
  gstRate,
  taxMode,
}: {
  sellerState: string;
  gstRate: number;
  taxMode: "gst" | "unregistered";
}) {
  const router = useRouter();
  const noGst = taxMode === "unregistered";
  const { lines, subtotal, count, ready, clear } = useCart();
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "",
  });
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Live GST: once a state is picked, show the actual CGST/SGST or IGST split.
  // In unregistered mode there is no GST at all.
  const gst = !noGst && form.state
    ? computeGstFromInclusive(subtotal, gstRate, form.state, sellerState)
    : null;
  const gstTotal = gstIncludedInTotal(subtotal, gstRate);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await placeOrder({
      items: lines.map((l) => ({ slug: l.slug, qty: l.qty, variantId: l.variantId || undefined })),
      customer: { name: form.name, email: form.email, phone: form.phone },
      address: {
        line1: form.line1, line2: form.line2, city: form.city,
        state: form.state, pincode: form.pincode,
      },
      paymentMethod: payment,
    });
    if ("error" in res && res.error) {
      setError(res.error);
      setBusy(false);
      return;
    }
    if ("ok" in res && res.ok) {
      clear();
      if (res.result.paymentMethod === "cod") {
        router.push(`/order/${res.result.orderId}`);
      } else {
        router.push(`/checkout/pay?order=${res.result.orderId}`);
      }
    }
  }

  if (ready && lines.length === 0) {
    return (
      <section className="mx-auto max-w-[760px] px-5 py-24 text-center sm:px-8">
        <h1 className="font-heading text-3xl text-ink">Your bag is empty</h1>
        <p className="mt-3 text-ink-muted">Add a piece before checking out.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink">
          Shop the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
      <h1 className="font-heading text-4xl text-ink lg:text-5xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted">
        Test mode: no real money moves.{" "}
        {noGst
          ? "GST is not charged as the seller is not currently registered under GST."
          : "GST is computed from your state and shown on the confirmation."}
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-5">
            <legend className="font-heading text-xl text-ink">Contact</legend>
            <div>
              <label htmlFor="name" className={labelClass}>Full name</label>
              <input id="name" required value={form.name} onChange={set("name")} className={inputClass} placeholder="Your name" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" type="email" required value={form.email} onChange={set("email")} className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input id="phone" type="tel" required value={form.phone} onChange={set("phone")} className={inputClass} placeholder="10-digit mobile" />
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-2 flex flex-col gap-5">
            <legend className="font-heading text-xl text-ink">Shipping address</legend>
            <div>
              <label htmlFor="line1" className={labelClass}>Address</label>
              <input id="line1" required value={form.line1} onChange={set("line1")} className={inputClass} placeholder="House, street, area" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" required value={form.city} onChange={set("city")} className={inputClass} placeholder="City" />
              </div>
              <div>
                <label htmlFor="pincode" className={labelClass}>PIN code</label>
                <input id="pincode" required value={form.pincode} onChange={set("pincode")} className={inputClass} placeholder="6-digit PIN" />
              </div>
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>State</label>
              <select id="state" required value={form.state} onChange={set("state")} className={inputClass}>
                <option value="" disabled>Select your state</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </fieldset>

          <fieldset className="mt-2 flex flex-col gap-3">
            <legend className="font-heading text-xl text-ink">Payment</legend>
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink">
              <input type="radio" name="pay" checked={payment === "online"} onChange={() => setPayment("online")} />
              Pay online (test mode)
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink">
              <input type="radio" name="pay" checked={payment === "cod"} onChange={() => setPayment("cod")} />
              Cash on delivery
            </label>
          </fieldset>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
          <h2 className="font-heading text-xl text-ink">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map((l) => (
              <li key={l.lineId} className="flex justify-between gap-3 text-sm">
                <span className="text-ink-muted">
                  {l.name}
                  {l.variantLabel && l.variantLabel !== "Standard" ? <span className="text-ink-muted/70"> ({l.variantLabel})</span> : null}
                  <span className="text-ink-muted/70"> &times; {l.qty}</span>
                </span>
                <span className="text-ink">{formatInr(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          {noGst ? (
            <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
              <div className="flex justify-between text-ink-muted"><dt>Shipping</dt><dd>free in test mode</dd></div>
            </dl>
          ) : (
            <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
              <div className="flex justify-between text-ink-muted"><dt>Taxable value</dt><dd>{formatInr(subtotal - gstTotal)}</dd></div>
              {gst ? (
                gst.isIntraState ? (
                  <>
                    <div className="flex justify-between text-ink-muted"><dt>CGST ({gstRate / 2}%)</dt><dd>{formatInr(gst.cgst)}</dd></div>
                    <div className="flex justify-between text-ink-muted"><dt>SGST ({gstRate / 2}%)</dt><dd>{formatInr(gst.sgst)}</dd></div>
                  </>
                ) : (
                  <div className="flex justify-between text-ink-muted"><dt>IGST ({gstRate}%)</dt><dd>{formatInr(gst.igst)}</dd></div>
                )
              ) : (
                <div className="flex justify-between text-ink-muted"><dt>GST ({gstRate}%, incl.)</dt><dd>{formatInr(gstTotal)}</dd></div>
              )}
              <div className="flex justify-between text-ink-muted"><dt>Shipping</dt><dd>free in test mode</dd></div>
            </dl>
          )}
          {noGst ? (
            <p className="mt-3 text-xs text-ink-muted/80">GST is not charged on this order.</p>
          ) : !form.state ? (
            <p className="mt-3 text-xs text-ink-muted/80">Select your state to see the CGST/SGST or IGST split.</p>
          ) : null}
          <div className="mt-5 flex justify-between border-t border-border pt-5 text-ink">
            <span className="font-medium">Total</span><span className="font-medium">{formatInr(subtotal)}</span>
          </div>
          {error ? <p className="mt-4 text-sm text-error" role="alert">{error}</p> : null}
          <button type="submit" disabled={busy} className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-colors hover:bg-ink disabled:opacity-60">
            {busy ? "Placing order…" : payment === "cod" ? "Place order (COD)" : "Continue to payment"}
          </button>
        </aside>
      </form>
    </section>
  );
}
