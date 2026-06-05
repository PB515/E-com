import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ManualOrderForm from "@/components/admin/ManualOrderForm";

export const dynamic = "force-dynamic";

export default async function CreateOrderPage() {
  const sb = await createClient();
  const [{ data }, { data: ts }] = await Promise.all([
    sb
      .from("products")
      .select("id,name,price_inr, product_variants(id,label,price_inr,stock,is_active,sort_order)")
      .eq("is_active", true)
      .order("name"),
    sb.from("tax_settings").select("tax_mode").eq("id", 1).maybeSingle(),
  ]);
  const showGst = ts?.tax_mode !== "unregistered";

  const catalog = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price_inr: p.price_inr,
    variants: (p.product_variants ?? [])
      .filter((v: any) => v.is_active)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((v: any) => ({ id: v.id, label: v.label, price_inr: v.price_inr, stock: v.stock })),
  }));

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-ink-muted hover:text-ink">← Orders</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">Create order</h1>
      <p className="mt-2 text-sm text-ink-muted">
        For WhatsApp / Instagram / phone / exhibition / marketplace sales. Stock deducts and the customer profile updates, just like a website order.
      </p>
      <ManualOrderForm catalog={catalog} showGst={showGst} />
    </div>
  );
}
