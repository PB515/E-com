"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { HONEYPOT_FIELD } from "@/lib/security";
import { subscribeNewsletter } from "@/app/(storefront)/actions";

// Secondary CTA — festive-drops capture (doc 01 Flow 2). Persists to Supabase
// via a server action (honeypot + server-side validation).
export default function NewsletterBand() {
  const [note, setNote] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await subscribeNewsletter({
      email: String(fd.get("email") ?? ""),
      hp: String(fd.get(HONEYPOT_FIELD) ?? ""),
    });
    setNote("error" in r && r.error ? r.error : "You're on the list for festive drops.");
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
      <div className="rounded-3xl border border-border bg-surface px-8 py-14 text-center lg:px-16">
        <h2 className="font-heading text-3xl text-ink sm:text-4xl">
          Festive drops and restocks
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">
          Be first when new pieces land. Occasional emails, no spam.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left sm:flex-row sm:items-end"
        >
          {/* honeypot — hidden from people, filled by bots (lib/security.ts) */}
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="flex-1">
            <label
              htmlFor="newsletter-email"
              className="mb-2 block text-xs uppercase tracking-[0.14em] text-ink-muted"
            >
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full rounded-full border border-border bg-surface-2 px-5 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>
          <Button type="submit">Notify me</Button>
        </form>

        {note ? (
          <p className="mt-4 text-sm text-primary" role="status">
            {note}
          </p>
        ) : null}
      </div>
    </section>
  );
}
