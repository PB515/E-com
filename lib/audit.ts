import "server-only";
import { createClient } from "@/lib/supabase/server";

// Best-effort admin audit log. Records who did what; never blocks the action.
// RLS allows only an admin to insert/read (migration 0003).
export async function logAdminAction(
  action: string,
  entity: string,
  entityId: string | null,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    await sb.from("admin_audit").insert({
      actor_email: user?.email ?? null,
      action,
      entity,
      entity_id: entityId,
      details: details ?? null,
    });
  } catch {
    // audit must never break the underlying action
  }
}
