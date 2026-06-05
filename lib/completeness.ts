// Product completeness score — how launch-ready a listing is.
// Pure function; used in the admin products list + edit page.

export interface CompletenessField {
  key: string;
  label: string;
  ok: boolean;
}

export interface Completeness {
  score: number; // 0-100
  passed: number;
  total: number;
  fields: CompletenessField[];
}

export function scoreProduct(p: any, hasImage: boolean): Completeness {
  const has = (v: unknown) => typeof v === "string" && v.trim().length > 0;
  const checks: CompletenessField[] = [
    { key: "photo", label: "Photo", ok: hasImage },
    { key: "price", label: "Price", ok: Number(p.price_inr) > 0 },
    { key: "stock", label: "Stock set", ok: Number.isFinite(Number(p.stock)) },
    { key: "hsn", label: "HSN code", ok: has(p.hsn_code) },
    { key: "gst", label: "GST rate", ok: Number(p.gst_rate) > 0 },
    { key: "story", label: "Heritage story", ok: has(p.story) && p.story.trim().length > 20 },
    { key: "motif", label: "Motif", ok: has(p.motif) },
    { key: "region", label: "Region", ok: has(p.region) },
    { key: "occasion", label: "Occasion", ok: has(p.occasion) },
    { key: "material", label: "Material", ok: has(p.material) },
    { key: "size", label: "Size", ok: has(p.size) },
    { key: "care", label: "Care", ok: has(p.care) },
    { key: "weight", label: "Weight (g)", ok: Number(p.weight_grams) > 0 },
    { key: "dims", label: "Dimensions", ok: Number(p.length_cm) > 0 && Number(p.breadth_cm) > 0 && Number(p.height_cm) > 0 },
    { key: "seo_title", label: "SEO title", ok: has(p.seo_title) },
    { key: "seo_desc", label: "SEO description", ok: has(p.seo_description) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  return { score: Math.round((passed / checks.length) * 100), passed, total: checks.length, fields: checks };
}
