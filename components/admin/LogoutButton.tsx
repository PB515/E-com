"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  async function logout() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className={
        className ||
        "rounded-full border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
      }
    >
      Sign out
    </button>
  );
}
