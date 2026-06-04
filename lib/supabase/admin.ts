import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVICE-ROLE client — bypasses RLS. SERVER-ONLY (the `server-only` import
// makes a client-bundle import a build error). Use strictly for trusted server
// writes: creating orders/invoices at checkout, the idempotent webhook marking
// an order paid, persisting subscribers/returns. NEVER expose the service key.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
