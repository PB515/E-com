import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { scoreProduct } from "@/lib/completeness";
import LaunchFlagToggle from "@/components/admin/LaunchFlagToggle";

export const dynamic = "force-dynamic";

interface Row {
  label: string;
  ok: boolean;
  note: string;
  manualKey?: string;
}

export default async function LaunchReadinessPage() {
  const sb = await createClient();
  const { data: tax } = await sb.from("tax_settings").select("*").eq("id", 1).maybeSingle();
  const { data: products } = await sb.from("products").select("*, product_images(url,is_primary)").eq("is_active", true);

  const flags = (tax?.launch_flags as Record<string, boolean>) ?? {};
  const actives = products ?? [];
  const withPhoto = actives.filter((p: any) => (p.product_images?.length ?? 0) > 0).length;
  const withPrice = actives.filter((p: any) => Number(p.price_inr) > 0).length;
  const complete = actives.filter((p: any) => scoreProduct(p, (p.product_images?.length ?? 0) > 0).score >= 80).length;
  const total = actives.length;

  const provider = process.env.PAYMENT_PROVIDER || "mock";

  const auto: Row[] = [
    { label: "GSTIN added", ok: !!tax?.gstin, note: tax?.gstin ? tax.gstin : "Add it in Tax settings" },
    { label: "Live payments (Razorpay)", ok: provider === "razorpay", note: provider === "razorpay" ? "Razorpay is live" : "Currently mock/test (PAYMENT_PROVIDER=mock)" },
    { label: "Email configured (Resend)", ok: !!process.env.RESEND_API_KEY, note: process.env.RESEND_API_KEY ? "Key present" : "Set RESEND_API_KEY" },
    { label: "Shipping configured (Shiprocket)", ok: !!process.env.SHIPROCKET_EMAIL, note: process.env.SHIPROCKET_EMAIL ? "Credentials present" : "Set Shiprocket credentials" },
    { label: "All products have a photo", ok: total > 0 && withPhoto === total, note: `${withPhoto}/${total} active products` },
    { label: "All products have a price", ok: total > 0 && withPrice === total, note: `${withPrice}/${total} active products` },
    { label: "Listings complete (≥80%)", ok: total > 0 && complete === total, note: `${complete}/${total} active products` },
  ];

  const manual: Row[] = [
    { label: "Real product photos uploaded", ok: !!flags.real_photos, note: "Swap placeholders for real shots", manualKey: "real_photos" },
    { label: "Privacy policy reviewed", ok: !!flags.privacy_reviewed, note: "Matches deployed analytics (DPDP)", manualKey: "privacy_reviewed" },
    { label: "CA verified a sample invoice", ok: !!flags.ca_verified, note: "One intra-state + one inter-state", manualKey: "ca_verified" },
    { label: "Shiprocket pickup location set", ok: !!flags.pickup_set, note: "Needed for real labels", manualKey: "pickup_set" },
  ];

  const all = [...auto, ...manual];
  const done = all.filter((r) => r.ok).length;
  const pct = Math.round((done / all.length) * 100);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-ink">Launch readiness</h1>
        <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${pct === 100 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
          {done}/{all.length} ready · {pct}%
        </span>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Everything that should be true before promoting the store beyond test mode.
      </p>

      <Section title="Automatic checks" rows={auto} />
      <Section title="Manual sign-off" rows={manual} />

      <p className="mt-8 text-xs text-ink-muted">
        Until live payments are on (PAYMENT_PROVIDER=razorpay), the store runs in test mode.
        Tax/GSTIN is set in <Link href="/admin/tax-settings" className="text-primary hover:underline">Tax settings</Link>;
        photos and completeness in <Link href="/admin/products" className="text-primary hover:underline">Products</Link>.
      </p>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="mt-8">
      <h2 className="font-heading text-lg text-ink">{title}</h2>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className={`text-lg ${r.ok ? "text-success" : "text-warning"}`}>{r.ok ? "✓" : "○"}</span>
              <div>
                <p className="text-sm text-ink">{r.label}</p>
                <p className="text-xs text-ink-muted">{r.note}</p>
              </div>
            </div>
            {r.manualKey ? <LaunchFlagToggle flagKey={r.manualKey} checked={r.ok} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
