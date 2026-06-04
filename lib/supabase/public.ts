import { createClient } from "@supabase/supabase-js";

// Cookie-less anon client for PUBLIC reads (active products). No session, so
// pages using it can be cached/dynamic without dragging in request cookies.
// RLS still applies — this only ever sees what the public policy allows.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
