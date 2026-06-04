import { createClient } from "@/lib/supabase/server";
import TaxSettingsForm from "@/components/admin/TaxSettingsForm";

export const dynamic = "force-dynamic";

export default async function TaxSettingsPage() {
  const sb = await createClient();
  const { data } = await sb.from("tax_settings").select("*").eq("id", 1).maybeSingle();
  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Tax settings</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        These are admin-editable. The rate and HSN are snapshotted onto each
        invoice at sale, so changing them affects future invoices only.
      </p>
      <TaxSettingsForm initial={data} />
    </div>
  );
}
