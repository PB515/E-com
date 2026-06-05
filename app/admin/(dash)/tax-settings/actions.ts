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
  tax_mode: "gst" | "unregistered";
}

// RLS admin policy enforces that only an admin can write tax_settings.
export async function updateTaxSettings(input: TaxSettingsInput) {
  const sb = await createClient();
  const mode = input.tax_mode === "unregistered" ? "unregistered" : "gst";

  // read the prior mode so a mode CHANGE is captured in the audit trail
  const { data: prev } = await sb.from("tax_settings").select("tax_mode").eq("id", 1).maybeSingle();
  const prevMode = prev?.tax_mode === "unregistered" ? "unregistered" : "gst";

  const { error } = await sb
    .from("tax_settings")
    .update({
      business_name: input.business_name,
      gstin: input.gstin.trim() || null,
      registered_state: input.registered_state,
      default_gst_rate: input.default_gst_rate,
      default_hsn: input.default_hsn,
      tax_mode: mode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) return { error: error.message };

  if (mode !== prevMode) {
    // a tax-mode change is a compliance event — log it explicitly
    await logAdminAction("tax.mode_change", "tax_settings", "1", { from: prevMode, to: mode });
  }
  await logAdminAction("tax.update", "tax_settings", "1", { gst_rate: input.default_gst_rate, gstin: input.gstin.trim() ? "set" : "blank", tax_mode: mode });
  revalidatePath("/admin/tax-settings");
  revalidatePath("/checkout");
  revalidatePath("/");
  return { ok: true as const };
}
