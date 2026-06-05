"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAdminAction } from "@/lib/audit";

export async function setLaunchFlag(key: string, value: boolean) {
  const sb = await createClient();
  const { data: ts } = await sb.from("tax_settings").select("launch_flags").eq("id", 1).maybeSingle();
  const flags = { ...((ts?.launch_flags as Record<string, boolean>) ?? {}), [key]: value };
  const { error } = await sb.from("tax_settings").update({ launch_flags: flags }).eq("id", 1);
  if (error) return { error: error.message };
  await logAdminAction("launch.flag", "tax_settings", key, { value });
  revalidatePath("/admin/launch");
  return { ok: true as const };
}
