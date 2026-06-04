"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { HONEYPOT_FIELD } from "@/lib/security";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

// UI-only (Phase 4 wires persistence + honeypot/validate/rate-limit server-side).
export default function ContactForm() {
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNote("Thanks. Messages start sending once the contact inbox goes live.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div>
        <label htmlFor="c-name" className={labelClass}>Name</label>
        <input id="c-name" name="name" required className={inputClass} placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="c-email" className={labelClass}>Email</label>
        <input id="c-email" name="email" type="email" required className={inputClass} placeholder="you@email.com" />
      </div>
      <div>
        <label htmlFor="c-message" className={labelClass}>Message</label>
        <textarea id="c-message" name="message" required rows={5} className={inputClass} placeholder="How can we help?" />
      </div>
      <div>
        <Button type="submit">Send message</Button>
      </div>
      {note ? <p className="text-sm text-primary" role="status">{note}</p> : null}
    </form>
  );
}
