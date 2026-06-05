"use client";

import { useState } from "react";
import { updateTaxSettings } from "@/app/admin/(dash)/tax-settings/actions";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function TaxSettingsForm({ initial }: { initial: any }) {
  const initialMode: "gst" | "unregistered" = initial?.tax_mode === "unregistered" ? "unregistered" : "gst";
  const [f, setF] = useState({
    business_name: initial?.business_name ?? "Bugadi",
    gstin: initial?.gstin ?? "",
    registered_state: initial?.registered_state ?? "Maharashtra",
    default_gst_rate: String(initial?.default_gst_rate ?? "12"),
    default_hsn: initial?.default_hsn ?? "7117",
  });
  const [mode, setMode] = useState<"gst" | "unregistered">(initialMode);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // compliance gate: changing the tax MODE alters checkout, invoices, and
    // reports — require an explicit, accountant-aware confirmation.
    if (mode !== initialMode) {
      const to = mode === "unregistered"
        ? "UNREGISTERED (small seller): no GST will be charged or shown, and documents become plain retail receipts marked \"not a GST tax invoice\"."
        : "GST REGISTERED: GST will be computed, split (CGST/SGST or IGST), and documents become GST tax invoices.";
      if (!confirm(
        `Change Business Tax Mode to ${to}\n\n` +
        `This affects checkout tax calculation, invoice wording, and compliance reports for all FUTURE orders (past orders are unchanged). ` +
        `Only change this after confirming with your accountant. Continue?`,
      )) return;
    }
    // danger-zone: confirm changes to the rate or GSTIN (affects future invoices)
    const rateChanged = String(initial?.default_gst_rate ?? "") !== String(f.default_gst_rate);
    const gstinChanged = String(initial?.gstin ?? "") !== String(f.gstin);
    if (rateChanged || gstinChanged) {
      const what = [rateChanged ? "GST rate" : "", gstinChanged ? "GSTIN" : ""].filter(Boolean).join(" and ");
      if (!confirm(`You are changing the ${what}. This affects all FUTURE invoices (past invoices are unchanged). Continue?`)) return;
    }
    setBusy(true);
    setMsg("");
    const r = await updateTaxSettings({
      business_name: f.business_name,
      gstin: f.gstin,
      registered_state: f.registered_state,
      default_gst_rate: Number(f.default_gst_rate),
      default_hsn: f.default_hsn,
      tax_mode: mode,
    });
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : "Saved. New orders use these values; past orders and invoices are unchanged.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
      {/* Business Tax Mode — the controlled switch (not a casual GST on/off) */}
      <fieldset className="rounded-2xl border border-border bg-surface p-5">
        <legend className="px-1 text-sm font-medium text-ink">Business tax mode</legend>
        <p className="mt-1 text-sm text-ink-muted">
          Set by your legal GST status. Changing it affects checkout, invoices, and reports for future orders only.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${mode === "gst" ? "border-ink bg-surface-2" : "border-border"}`}>
            <input type="radio" name="taxmode" className="mt-1" checked={mode === "gst"} onChange={() => setMode("gst")} />
            <span>
              <span className="block text-sm font-medium text-ink">GST registered</span>
              <span className="block text-sm text-ink-muted">Bugadi has a GSTIN. Prices shown GST-inclusive, CGST/SGST or IGST split, GST tax invoices.</span>
            </span>
          </label>
          <label className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${mode === "unregistered" ? "border-ink bg-surface-2" : "border-border"}`}>
            <input type="radio" name="taxmode" className="mt-1" checked={mode === "unregistered"} onChange={() => setMode("unregistered")} />
            <span>
              <span className="block text-sm font-medium text-ink">Unregistered (small seller)</span>
              <span className="block text-sm text-ink-muted">No GSTIN. No GST charged or shown. Documents are plain retail receipts marked &ldquo;not a GST tax invoice&rdquo;.</span>
            </span>
          </label>
        </div>
        {mode !== initialMode ? (
          <p className="mt-3 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning">
            You are switching tax mode. Confirm with your accountant first — this changes tax on every future order and the wording on invoices.
          </p>
        ) : null}
        {mode === "unregistered" ? (
          <p className="mt-3 text-xs text-ink-muted">
            Checkout will say &ldquo;GST is not charged as the seller is not currently registered under GST.&rdquo; Have your CA confirm the final receipt wording.
          </p>
        ) : null}
      </fieldset>
      <div>
        <label htmlFor="bn" className={labelClass}>Business name</label>
        <input id="bn" value={f.business_name} onChange={set("business_name")} className={inputClass} />
      </div>
      <div>
        <label htmlFor="gstin" className={labelClass}>GSTIN <span className="text-ink-muted">(blank until obtained)</span></label>
        <input id="gstin" value={f.gstin} onChange={set("gstin")} className={inputClass} placeholder="e.g. 27ABCDE1234F1Z5" />
      </div>
      <div>
        <label htmlFor="state" className={labelClass}>Registered state <span className="text-ink-muted">(sets place-of-supply)</span></label>
        <select id="state" value={f.registered_state} onChange={set("registered_state")} className={inputClass}>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="rate" className={labelClass}>Default GST rate %</label>
          <input id="rate" type="number" step="0.01" value={f.default_gst_rate} onChange={set("default_gst_rate")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="hsn" className={labelClass}>Default HSN</label>
          <input id="hsn" value={f.default_hsn} onChange={set("default_hsn")} className={inputClass} />
        </div>
      </div>
      <div>
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
      {msg ? <p className="text-sm text-primary" role="status">{msg}</p> : null}
    </form>
  );
}
