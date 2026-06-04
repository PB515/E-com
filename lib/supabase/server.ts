import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Supabase client bound to the request cookies (anon key + the user's
// session). Use in Server Components, route handlers, and the /admin guard.
// RLS applies — this client only sees what the logged-in user is allowed to.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // called from a Server Component without a writable cookie store;
            // safe to ignore when middleware refreshes the session.
          }
        },
      },
    },
  );
}
