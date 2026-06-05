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
  const [f, setF] = useState({
    business_name: initial?.business_name ?? "Bugadi",
    gstin: initial?.gstin ?? "",
    registered_state: initial?.registered_state ?? "Maharashtra",
    default_gst_rate: String(initial?.default_gst_rate ?? "12"),
    default_hsn: initial?.default_hsn ?? "7117",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    });
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : "Saved. New invoices use these values; past invoices are unchanged.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-xl flex-col gap-5">
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
