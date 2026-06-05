"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setLaunchFlag } from "@/app/admin/(dash)/launch/actions";

export default function LaunchFlagToggle({
  flagKey,
  checked,
}: {
  flagKey: string;
  checked: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    await setLaunchFlag(flagKey, !checked);
    setBusy(false);
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`rounded-full px-4 py-1.5 text-xs font-medium ${checked ? "bg-success/15 text-success" : "border border-border text-ink-muted hover:text-ink"}`}
    >
      {checked ? "Done ✓" : "Mark done"}
    </button>
  );
}
