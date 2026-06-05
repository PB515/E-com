"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";

export interface TaxSettingsInput {
  business_name: string;
  gstin: string;
  registered_state: string;
  default_gst_rate: number;
  default_hsn: string;
}

// RLS admin policy enforces that only an admin can write tax_settings.
export async function updateTaxSettings(input: TaxSettingsInput) {
  const sb = await createClient();
  const { error } = await sb
    .from("tax_settings")
    .update({
      business_name: input.business_name,
      gstin: input.gstin.trim() || null,
      registered_state: input.registered_state,
      default_gst_rate: input.default_gst_rate,
      default_hsn: input.default_hsn,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };
  await logAdminAction("tax.update", "tax_settings", "1", { gst_rate: input.default_gst_rate, gstin: input.gstin.trim() ? "set" : "blank" });
  revalidatePath("/admin/tax-settings");
  return { ok: true as const };
}
