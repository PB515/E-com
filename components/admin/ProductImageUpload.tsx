"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/app/admin/(dash)/products/actions";

export default function ProductImageUpload({
  slug,
  currentUrl,
}: {
  slug: string;
  currentUrl?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(currentUrl);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadProductImage(slug, fd);
    setBusy(false);
    if ("error" in r && r.error) {
      setMsg(r.error);
      return;
    }
    if ("url" in r && r.url) {
      setPreview(r.url);
      setMsg("Image updated.");
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-5">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-2">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-muted">No image</div>
        )}
      </div>
      <div>
        <label className="inline-block cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm text-ink transition-colors hover:bg-surface">
          {busy ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={onChange} disabled={busy} />
        </label>
        {msg ? <p className="mt-2 text-sm text-primary" role="status">{msg}</p> : null}
        <p className="mt-1 text-xs text-ink-muted">JPG or PNG, up to 5 MB. Becomes the product's main photo.</p>
      </div>
    </div>
  );
}
