"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { HONEYPOT_FIELD } from "@/lib/security";
import { submitReturn } from "@/app/(storefront)/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

// 7-day damaged/wrong returns (doc 01 Flow 3). Persists to Supabase via a server
// action; an admin approval issues a credit note that reverses the GST.
export default function ReturnForm() {
  const [note, setNote] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await submitReturn({
      order: String(fd.get("order") ?? ""),
      reason: String(fd.get("reason") ?? ""),
      note: String(fd.get("note") ?? ""),
      hp: String(fd.get(HONEYPOT_FIELD) ?? ""),
    });
    setNote("error" in r && r.error ? r.error : "Thanks. We've logged your return request and will be in touch.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div>
        <label htmlFor="r-order" className={labelClass}>Order number</label>
        <input id="r-order" name="order" required className={inputClass} placeholder="e.g. BUG-10231" />
      </div>
      <div>
        <label htmlFor="r-reason" className={labelClass}>Reason</label>
        <select id="r-reason" name="reason" required defaultValue="" className={inputClass}>
          <option value="" disabled>Select a reason</option>
          <option value="damaged">Item arrived damaged</option>
          <option value="wrong_item">Wrong item received</option>
        </select>
      </div>
      <div>
        <label htmlFor="r-note" className={labelClass}>What happened?</label>
        <textarea id="r-note" name="note" rows={4} className={inputClass} placeholder="A short description helps us sort it quickly." />
      </div>
      <div>
        <Button type="submit">Request a return</Button>
      </div>
      {note ? <p className="text-sm text-primary" role="status">{note}</p> : null}
    </form>
  );
}
