import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (anon key — safe for the client). Used for any
// client-side reads of PUBLIC data (active products). Never use the service
// role here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
