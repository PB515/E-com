"use server";

import { createOrder, markOrderPaid, type CheckoutInput } from "@/lib/orders";

function nonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export async function placeOrder(input: CheckoutInput) {
  // server-side validation (never trust the client)
  if (!input.items?.length) return { error: "Your bag is empty." };
  const c = input.customer;
  const a = input.address;
  if (!nonEmpty(c?.name) || !nonEmpty(c?.email) || !nonEmpty(c?.phone))
    return { error: "Please fill your name, email, and phone." };
  if (
    !nonEmpty(a?.line1) ||
    !nonEmpty(a?.city) ||
    !nonEmpty(a?.state) ||
    !nonEmpty(a?.pincode)
  )
    return { error: "Please complete your shipping address." };
  if (input.paymentMethod !== "online" && input.paymentMethod !== "cod")
    return { error: "Choose a payment method." };

  try {
    const result = await createOrder(input);
    return { ok: true as const, result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not place order." };
  }
}

// Mock "payment". In real Razorpay mode the webhook route marks the order paid;
// here the simulate-success button calls this, and markOrderPaid is idempotent.
export async function payMockAction(orderId: string) {
  const r = await markOrderPaid(orderId);
  return r;
}
