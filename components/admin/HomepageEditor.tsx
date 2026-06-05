"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateSiteContent, uploadHeroImage, clearHeroImage } from "@/app/admin/(dash)/homepage/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";
const sectionClass = "rounded-2xl border border-border bg-surface p-5";

export default function HomepageEditor({
  initial,
  heroImage,
}: {
  initial: Record<string, string>;
  heroImage: string;
}) {
  const router = useRouter();
  const [f, setF] = useState<Record<string, string>>(initial);
  const [img, setImg] = useState(heroImage);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  function field(k: string, label: string, ph: string, textarea = false) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        {textarea ? (
          <textarea value={f[k] ?? ""} onChange={set(k)} rows={2} placeholder={ph} className={inputClass} />
        ) : (
          <input value={f[k] ?? ""} onChange={set(k)} placeholder={ph} className={inputClass} />
        )}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const r = await updateSiteContent(f);
    setBusy(false);
    setMsg("error" in r && r.error ? r.error : "Saved. Blank fields use the default.");
    router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg("");
    const fd = new FormData(); fd.set("file", file);
    const r = await uploadHeroImage(fd);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    if ("url" in r && r.url) setImg(r.url);
    router.refresh();
  }

  async function onClearImage() {
    setBusy(true);
    await clearHeroImage();
    setImg("");
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
      <fieldset className={sectionClass}>
        <legend className="px-1 text-sm font-medium text-ink">Hero</legend>
        <div className="mt-3 flex flex-col gap-4">
          {field("hero_title", "Headline", "Traditional ornament,\nstyled to wear today.", true)}
          {field("hero_subtitle", "Subtext", "Oxidised, antique-finish jewellery. Each piece tied to its motif…", true)}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("hero_cta1_label", "Button 1 label", "Shop the collection")}
            {field("hero_cta1_href", "Button 1 link", "/shop")}
            {field("hero_cta2_label", "Button 2 label", "Our roots")}
            {field("hero_cta2_href", "Button 2 link", "/our-roots")}
          </div>
          <div>
            <p className={labelClass}>Hero image</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-border bg-surface-2">
                {img ? <Image src={img} alt="hero" fill className="object-cover" sizes="112px" /> : <span className="flex h-full items-center justify-center text-xs text-ink-muted">none</span>}
              </div>
              <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-ink hover:bg-surface-2">
                {img ? "Replace" : "Upload"}
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={busy} />
              </label>
              {img ? <button type="button" onClick={onClearImage} disabled={busy} className="text-sm text-ink-muted hover:text-ink">Remove</button> : null}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-sm font-medium text-ink">Section titles</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {field("category_title", "Category section heading", "Shop by category")}
          {field("featured_title", "Featured rail heading", "A considered edit")}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-sm font-medium text-ink">Trust strip</legend>
        <p className="mt-1 text-xs text-ink-muted">Four items (icons are fixed: shipping, COD, secure, returns).</p>
        <div className="mt-3 flex flex-col gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="grid gap-4 sm:grid-cols-2">
              {field(`trust${n}_label`, `Item ${n} title`, ["Pan-India shipping", "Cash on delivery", "Secure checkout", "7-day returns"][n - 1])}
              {field(`trust${n}_sub`, `Item ${n} subtext`, ["via Shiprocket", "available at checkout", "powered by Razorpay", "on damaged or wrong items"][n - 1])}
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-sm font-medium text-ink">Newsletter band</legend>
        <div className="mt-3 flex flex-col gap-4">
          {field("newsletter_title", "Title", "Festive drops and restocks")}
          {field("newsletter_subtitle", "Subtext", "Be first when new pieces land. Occasional emails, no spam.")}
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save homepage"}
        </button>
        {msg ? <p className="text-sm text-primary" role="status">{msg}</p> : null}
      </div>
    </form>
  );
}
