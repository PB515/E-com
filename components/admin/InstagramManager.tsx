"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUp, ArrowDown, Trash, Plus, VideoCamera } from "@phosphor-icons/react";
import type { AdminInstaPost } from "@/lib/instagram";
import {
  createInstagramPost, updateInstagramPost, toggleInstagramActive,
  moveInstagramPost, deleteInstagramPost, uploadInstagramImage,
} from "@/app/admin/(dash)/instagram/actions";

const inputClass = "rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70";

function Row({ post, first, last, onChange }: { post: AdminInstaPost; first: boolean; last: boolean; onChange: () => void }) {
  const [caption, setCaption] = useState(post.caption);
  const [url, setUrl] = useState(post.url);
  const [isReel, setIsReel] = useState(post.isReel);
  const [img, setImg] = useState(post.imageUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function run(fn: () => Promise<{ error?: string } | { ok: true }>) {
    setBusy(true); setMsg("");
    const r = await fn();
    setBusy(false);
    if (r && "error" in r && r.error) { setMsg(r.error); return false; }
    return true;
  }
  async function save() {
    if (await run(() => updateInstagramPost(post.id, { url, caption, is_reel: isReel }))) { setMsg("Saved."); onChange(); }
  }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.set("file", file);
    setBusy(true); setMsg("");
    const r = await uploadInstagramImage(post.id, fd);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    if ("url" in r && r.url) setImg(r.url);
    onChange();
  }

  return (
    <tr className="border-t border-border align-top">
      <td className="px-3 py-3">
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={() => run(() => moveInstagramPost(post.id, "up")).then(onChange)} disabled={busy || first} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowUp size={14} /></button>
          <button type="button" onClick={() => run(() => moveInstagramPost(post.id, "down")).then(onChange)} disabled={busy || last} className="text-ink-muted hover:text-ink disabled:opacity-30"><ArrowDown size={14} /></button>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border bg-surface-2">
          {img ? <Image src={img} alt="" fill className="object-cover" sizes="64px" /> : <span className="flex h-full items-center justify-center text-[10px] text-ink-muted">none</span>}
        </div>
        <label className="mt-1 block cursor-pointer text-center text-[11px] text-primary hover:underline">
          {img ? "Replace" : "Upload"}
          <input type="file" accept="image/*" onChange={upload} className="hidden" disabled={busy} />
        </label>
      </td>
      <td className="px-3 py-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} className={`${inputClass} w-full`} placeholder="https://www.instagram.com/p/…" />
        <input value={caption} onChange={(e) => setCaption(e.target.value)} className={`${inputClass} mt-2 w-full`} placeholder="Caption (optional)" />
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-ink"><input type="checkbox" checked={isReel} onChange={(e) => setIsReel(e.target.checked)} /> <VideoCamera size={13} /> Reel</label>
          <button type="button" onClick={save} disabled={busy} className="rounded-full bg-primary px-3 py-1 font-medium text-primary-ink hover:bg-ink disabled:opacity-60">Save</button>
          {msg ? <span className={msg === "Saved." ? "text-primary" : "text-error"}>{msg}</span> : null}
        </div>
      </td>
      <td className="px-3 py-3">
        <button type="button" onClick={() => run(() => toggleInstagramActive(post.id, !post.isActive)).then(onChange)} disabled={busy}
          className={`rounded-full border px-3 py-1 text-xs ${post.isActive ? "border-success/40 bg-success/15 text-success" : "border-border text-ink-muted"}`}>
          {post.isActive ? "Visible" : "Hidden"}
        </button>
      </td>
      <td className="px-3 py-3 text-right">
        <button type="button" onClick={() => { if (confirm("Remove this post from the site?")) run(() => deleteInstagramPost(post.id)).then(onChange); }} disabled={busy} className="text-error/80 hover:text-error disabled:opacity-30"><Trash size={16} /></button>
      </td>
    </tr>
  );
}

export default function InstagramManager({ initial }: { initial: AdminInstaPost[] }) {
  const router = useRouter();
  const [rows] = useState(initial);
  const [url, setUrl] = useState("");
  const [isReel, setIsReel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const refresh = () => router.refresh();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const r = await createInstagramPost({ url, is_reel: isReel });
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setUrl(""); setIsReel(false); refresh();
  }

  return (
    <div className="mt-6">
      <form onSubmit={add} className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex-1 min-w-[260px]">
          <label className="mb-1 block text-xs text-ink-muted">Instagram post or reel link</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" className={`${inputClass} w-full`} />
        </div>
        <label className="flex items-center gap-1.5 pb-2 text-sm text-ink"><input type="checkbox" checked={isReel} onChange={(e) => setIsReel(e.target.checked)} /> Reel</label>
        <button type="submit" disabled={busy || !url.trim()} className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          <Plus size={15} /> Add
        </button>
      </form>
      {msg ? <p className="mt-3 text-sm text-error" role="alert">{msg}</p> : null}
      <p className="mt-3 text-xs text-ink-muted">After adding, upload a thumbnail for the card (we don&rsquo;t pull images from Instagram automatically — that keeps the site fast and tracker-free).</p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-ink-muted">
            <tr>
              <th className="px-3 py-3">Order</th>
              <th className="px-3 py-3">Thumb</th>
              <th className="px-3 py-3">Link / caption</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <Row key={p.id} post={p} first={i === 0} last={i === rows.length - 1} onChange={refresh} />
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No posts yet. Paste a link above to start.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
