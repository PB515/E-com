"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Public form writes. RLS denies anon writes on these tables, so they go through
// the service-role client here (server-side only) after honeypot + validation.
// (Rate limiting is the remaining hardening item before full launch.)

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribeNewsletter(input: { email: string; hp: string }) {
  if (input.hp) return { ok: true as const }; // bot tripped the honeypot — silently accept
  const email = (input.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  const sb = createAdminClient();
  await sb
    .from("subscribers")
    .upsert({ email, source: "newsletter" }, { onConflict: "email", ignoreDuplicates: true });
  return { ok: true as const };
}

export async function submitReturn(input: {
  order: string;
  reason: string;
  note: string;
  hp: string;
}) {
  if (input.hp) return { ok: true as const };
  if (!input.order?.trim()) return { error: "Order number is required." };
  if (input.reason !== "damaged" && input.reason !== "wrong_item")
    return { error: "Select a reason." };
  const sb = createAdminClient();
  const { error } = await sb.from("return_requests").insert({
    order_number: input.order.trim(),
    reason: input.reason,
    note: input.note?.trim() || null,
  });
  if (error) return { error: "Could not submit. Please try again." };
  return { ok: true as const };
}
