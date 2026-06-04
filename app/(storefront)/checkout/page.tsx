import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_GST_RATE } from "@/lib/tax";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // Seller state + default rate drive the live CGST/SGST-vs-IGST split shown as
  // the buyer picks their state. Read server-side (tax_settings is admin-only).
  const sb = createAdminClient();
  const { data: ts } = await sb
    .from("tax_settings")
    .select("registered_state,default_gst_rate")
    .eq("id", 1)
    .maybeSingle();

  return (
    <CheckoutClient
      sellerState={ts?.registered_state ?? "Maharashtra"}
      gstRate={Number(ts?.default_gst_rate ?? DEFAULT_GST_RATE)}
    />
  );
}
