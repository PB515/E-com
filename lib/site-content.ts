import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";

// Built-in defaults mirror the original hardcoded homepage copy. A NULL/blank DB
// value falls back to these, so the homepage is identical until an admin edits.
export const HOME_DEFAULTS = {
  heroTitle: "Traditional ornament,\nstyled to wear today.",
  heroSubtitle: "Oxidised, antique-finish jewellery. Each piece tied to its motif, its region, and the occasion it belongs to.",
  heroCta1Label: "Shop the collection",
  heroCta1Href: "/shop",
  heroCta2Label: "Our roots",
  heroCta2Href: "/our-roots",
  heroImageUrl: "",
  categoryTitle: "Shop by category",
  featuredTitle: "A considered edit",
  newsletterTitle: "Festive drops and restocks",
  newsletterSubtitle: "Be first when new pieces land. Occasional emails, no spam.",
  trust: [
    { label: "Pan-India shipping", sub: "via Shiprocket" },
    { label: "Cash on delivery", sub: "available at checkout" },
    { label: "Secure checkout", sub: "powered by Razorpay" },
    { label: "7-day returns", sub: "on damaged or wrong items" },
  ],
};

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta1Label: string;
  heroCta1Href: string;
  heroCta2Label: string;
  heroCta2Href: string;
  heroImageUrl: string;
  categoryTitle: string;
  featuredTitle: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  trust: { label: string; sub: string }[];
}

const pick = (v: unknown, d: string): string => {
  const s = typeof v === "string" ? v.trim() : "";
  return s ? s : d;
};

const COLS =
  "hero_title,hero_subtitle,hero_cta1_label,hero_cta1_href,hero_cta2_label,hero_cta2_href,hero_image_url,category_title,featured_title,newsletter_title,newsletter_subtitle,trust1_label,trust1_sub,trust2_label,trust2_sub,trust3_label,trust3_sub,trust4_label,trust4_sub";

function resolve(r: Record<string, unknown> | null): HomeContent {
  const d = HOME_DEFAULTS;
  return {
    heroTitle: pick(r?.hero_title, d.heroTitle),
    heroSubtitle: pick(r?.hero_subtitle, d.heroSubtitle),
    heroCta1Label: pick(r?.hero_cta1_label, d.heroCta1Label),
    heroCta1Href: pick(r?.hero_cta1_href, d.heroCta1Href),
    heroCta2Label: pick(r?.hero_cta2_label, d.heroCta2Label),
    heroCta2Href: pick(r?.hero_cta2_href, d.heroCta2Href),
    heroImageUrl: pick(r?.hero_image_url, d.heroImageUrl),
    categoryTitle: pick(r?.category_title, d.categoryTitle),
    featuredTitle: pick(r?.featured_title, d.featuredTitle),
    newsletterTitle: pick(r?.newsletter_title, d.newsletterTitle),
    newsletterSubtitle: pick(r?.newsletter_subtitle, d.newsletterSubtitle),
    trust: [
      { label: pick(r?.trust1_label, d.trust[0].label), sub: pick(r?.trust1_sub, d.trust[0].sub) },
      { label: pick(r?.trust2_label, d.trust[1].label), sub: pick(r?.trust2_sub, d.trust[1].sub) },
      { label: pick(r?.trust3_label, d.trust[2].label), sub: pick(r?.trust3_sub, d.trust[2].sub) },
      { label: pick(r?.trust4_label, d.trust[3].label), sub: pick(r?.trust4_sub, d.trust[3].sub) },
    ],
  };
}

// Storefront: resolved content (override or default for every field).
export async function getHomeContent(): Promise<HomeContent> {
  try {
    const sb = createPublicClient();
    const { data } = await sb.from("site_content").select(COLS).eq("id", 1).maybeSingle();
    return resolve(data ?? null);
  } catch {
    return resolve(null);
  }
}

// Admin: the RAW row (nulls preserved) so the editor shows overrides vs blanks.
export async function getRawSiteContent(): Promise<Record<string, string>> {
  const sb = createAdminClient();
  const { data } = await sb.from("site_content").select(COLS).eq("id", 1).maybeSingle();
  const row = (data ?? {}) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const k of COLS.split(",")) out[k] = typeof row[k] === "string" ? (row[k] as string) : "";
  return out;
}
