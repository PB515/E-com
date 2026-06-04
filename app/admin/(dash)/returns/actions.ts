"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Approve a return -> issue a credit note that REVERSES the GST (Billing & GST
// module). The reversed amounts come from the order's snapshot, not recomputed.
export async function approveReturn(returnId: string) {
  const sb = await createClient();
  const { data: rr } = await sb.from("return_requests").select("*").eq("id", returnId).maybeSingle();
  if (!rr) return { error: "Return not found" };

  const { data: order } = await sb
    .from("orders")
    .select("id,order_number,grand_total_inr,total_tax_amount")
    .eq("order_number", rr.order_number ?? "")
    .maybeSingle();

  if (order) {
    const { data: invoice } = await sb.from("invoices").select("id").eq("order_id", order.id).maybeSingle();
    const { data: existing } = await sb.from("credit_notes").select("id").eq("return_request_id", returnId).maybeSingle();
    if (!existing) {
      await sb.from("credit_notes").insert({
        return_request_id: returnId,
        order_id: order.id,
        invoice_id: invoice?.id ?? null,
        amount_inr: order.grand_total_inr,
        tax_reversed_inr: order.total_tax_amount,
        credit_note_number: "CN-" + order.order_number,
      });
    }
  }

  await sb.from("return_requests").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", returnId);
  revalidatePath("/admin/returns");
  return { ok: true as const, hadOrder: !!order };
}

export async function rejectReturn(returnId: string) {
  const sb = await createClient();
  const { error } = await sb
    .from("return_requests")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", returnId);
  if (error) return { error: error.message };
  revalidatePath("/admin/returns");
  return { ok: true as const };
}
