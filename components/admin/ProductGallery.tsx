"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash } from "@phosphor-icons/react";
import {
  uploadProductImage,
  setPrimaryImage,
  deleteProductImage,
} from "@/app/admin/(dash)/products/actions";

interface Img {
  id: string;
  url: string;
  is_primary: boolean;
}

export default function ProductGallery({
  slug,
  images,
}: {
  slug: string;
  images: Img[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    setMsg("");
    for (const file of files) {
      const fd = new FormData();
      fd.set("file", file);
      const r = await uploadProductImage(slug, fd);
      if ("error" in r && r.error) { setMsg(r.error); break; }
    }
    setBusy(false);
    router.refresh();
    e.target.value = "";
  }

  async function makePrimary(id: string) {
    setBusy(true);
    await setPrimaryImage(slug, id);
    setBusy(false);
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(true);
    await deleteProductImage(slug, id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              {img.is_primary ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-ink">Primary</span>
              ) : (
                <button type="button" onClick={() => makePrimary(img.id)} disabled={busy} title="Make primary" className="absolute left-1.5 top-1.5 rounded-full bg-bg/80 p-1 text-ink-muted hover:text-ink">
                  <Star size={14} />
                </button>
              )}
              <button type="button" onClick={() => remove(img.id)} disabled={busy} title="Delete image" className="absolute right-1.5 top-1.5 rounded-full bg-bg/80 p-1 text-error hover:bg-error/20">
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">No images yet.</p>
      )}

      <div className="mt-4">
        <label className="inline-block cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm text-ink transition-colors hover:bg-surface-2">
          {busy ? "Uploading…" : "Upload image(s)"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={onUpload} disabled={busy} />
        </label>
        <p className="mt-1 text-xs text-ink-muted">JPG/PNG up to 5 MB each. The first becomes the main photo; click ★ to change the primary.</p>
        {msg ? <p className="mt-2 text-sm text-error" role="alert">{msg}</p> : null}
      </div>
    </div>
  );
}
