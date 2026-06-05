import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { asTaxMode, type TaxMode } from "@/lib/tax";

// The business tax mode for PUBLIC storefront display (price labels, GST notes).
// tax_settings is admin-only under RLS, so this reads via the service-role
// client on the server. Falls back to "gst" (current behaviour) on any error.
export async function getPublicTaxMode(): Promise<TaxMode> {
  try {
    const sb = createAdminClient();
    const { data } = await sb.from("tax_settings").select("tax_mode").eq("id", 1).maybeSingle();
    return asTaxMode(data?.tax_mode);
  } catch {
    return "gst";
  }
}
