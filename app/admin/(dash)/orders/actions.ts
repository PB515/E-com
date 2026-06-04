"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markFulfilled(orderId: string) {
  const sb = await createClient();
  const { error } = await sb
    .from("orders")
    .update({ status: "fulfilled" })
    .eq("id", orderId)
    .in("status", ["paid", "cod_confirmed"]);
  if (error) return { error: error.message };
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true as const };
}
