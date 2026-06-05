"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AdminCategory } from "@/lib/categories";
import { updateCategory, uploadCategoryImage } from "@/app/admin/(dash)/categories/actions";

const inputClass =
  "w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
const labelClass = "mb-2 block text-sm text-ink";

export default function CategoryEditor({ category }: { category: AdminCategory }) {
  const router = useRouter();
  const [f, setF] = useState({
    name: category.name,
    slug: category.slug,
    blurb: category.blurb,
    description: category.description,
    seo_title: category.seoTitle ?? "",
    seo_description: category.seoDescription ?? "",
    is_active: category.isActive,
    show_in_nav: category.showInNav,
    show_on_home: category.showOnHome,
    show_in_footer: category.showInFooter,
    nav_order: String(category.navOrder),
    home_order: String(category.homeOrder),
    footer_order: String(category.footerOrder),
  });
  const [imageUrl, setImageUrl] = useState(category.imageUrl);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));
  const check = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((s) => ({ ...s, [k]: e.target.checked }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (f.slug !== category.slug && !confirm("Changing the slug changes the category URL. Products move with it, but old links/SEO to the previous URL will break. Continue?")) return;
    setBusy(true);
    setMsg("");
    const r = await updateCategory(category.id, {
      name: f.name, slug: f.slug, blurb: f.blurb, description: f.description,
      seo_title: f.seo_title, seo_description: f.seo_description,
      is_active: f.is_active, show_in_nav: f.show_in_nav, show_on_home: f.show_on_home, show_in_footer: f.show_in_footer,
      nav_order: Number(f.nav_order) || 0, home_order: Number(f.home_order) || 0, footer_order: Number(f.footer_order) || 0,
    });
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    setMsg("Saved.");
    router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg("");
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadCategoryImage(category.id, fd);
    setBusy(false);
    if ("error" in r && r.error) { setMsg(r.error); return; }
    if ("url" in r && r.url) setImageUrl(r.url);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5">
      {/* image */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className={labelClass}>Card image</p>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-surface-2">
            {imageUrl ? <Image src={imageUrl} alt={f.name} fill className="object-cover" sizes="96px" /> : <span className="flex h-full items-center justify-center text-xs text-ink-muted">none</span>}
          </div>
          <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm text-ink hover:bg-surface-2">
            {imageUrl ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={onUpload} className="hidden" disabled={busy} />
          </label>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>Name</label><input value={f.name} onChange={set("name")} className={inputClass} /></div>
        <div><label className={labelClass}>Slug <span className="text-ink-muted">(URL)</span></label><input value={f.slug} onChange={set("slug")} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Blurb <span className="text-ink-muted">(short tagline on cards)</span></label><input value={f.blurb} onChange={set("blurb")} className={inputClass} placeholder="e.g. Statement neckpieces" /></div>
      <div><label className={labelClass}>Description <span className="text-ink-muted">(intro on the category page)</span></label><textarea value={f.description} onChange={set("description")} rows={3} className={inputClass} /></div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-medium text-ink">Visibility</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.is_active} onChange={check("is_active")} /> Active (master on/off)</label>
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.show_in_nav} onChange={check("show_in_nav")} /> Show in header nav</label>
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.show_on_home} onChange={check("show_on_home")} /> Show on homepage grid</label>
          <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={f.show_in_footer} onChange={check("show_in_footer")} /> Show in footer</label>
        </div>
        <p className="mt-3 text-xs text-ink-muted">Hiding keeps the category page live at its URL but removes it from menus — safer than deleting for SEO.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div><label className={labelClass}>Nav order</label><input type="number" value={f.nav_order} onChange={set("nav_order")} className={inputClass} /></div>
        <div><label className={labelClass}>Home order</label><input type="number" value={f.home_order} onChange={set("home_order")} className={inputClass} /></div>
        <div><label className={labelClass}>Footer order</label><input type="number" value={f.footer_order} onChange={set("footer_order")} className={inputClass} /></div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div><label className={labelClass}>SEO title</label><input value={f.seo_title} onChange={set("seo_title")} className={inputClass} /></div>
        <div><label className={labelClass}>SEO description</label><input value={f.seo_description} onChange={set("seo_description")} className={inputClass} /></div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={busy} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink hover:bg-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save category"}
        </button>
        {msg ? <p className={`text-sm ${msg === "Saved." ? "text-primary" : "text-error"}`} role="status">{msg}</p> : null}
      </div>
    </form>
  );
}
