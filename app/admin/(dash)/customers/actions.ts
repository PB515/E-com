"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";

export async function updateCustomerCRM(
  id: string,
  input: { notes: string; tags: string[] },
) {
  const sb = await createClient();
  const { error } = await sb
    .from("customers")
    .update({ notes: input.notes, tags: input.tags })
    .eq("id", id);
  if (error) return { error: error.message };
  await logAdminAction("customer.update", "customer", id, { tags: input.tags.length });
  revalidatePath(`/admin/customers/${id}`);
  return { ok: true as const };
}
