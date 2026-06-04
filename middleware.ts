import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Run on admin routes (session refresh + the logged-out gate). The storefront
// is public and needs no auth.
export const config = {
  matcher: ["/admin/:path*"],
};
