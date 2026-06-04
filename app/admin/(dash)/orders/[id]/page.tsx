import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";
import MarkFulfilledButton from "@/components/admin/MarkFulfilledButton";

export const dynamic = "force-dynamic";
const inr = (v: unknown) => formatInr(Number(v));

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await createClient();
  const { data: order } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const [{ data: customer }, { data: address }, { data: items }, { data: invoice }] = await Promise.all([
    sb.from("customers").select("*").eq("id", order.customer_id).maybeSingle(),
    sb.from("addresses").select("*").eq("id", order.address_id).maybeSingle(),
    sb.from("order_items").select("*").eq("order_id", id),
    sb.from("invoices").select("invoice_number").eq("order_id", id).maybeSingle(),
  ]);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-ink-muted hover:text-ink">← Orders</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-ink">{order.order_number}</h1>
        {order.status === "paid" || order.status === "cod_confirmed" ? (
          <MarkFulfilledButton orderId={id} />
        ) : (
          <span className="text-sm text-ink-muted">{order.status}</span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {order.status} · {order.payment_method} · {invoice?.invoice_number ?? "no invoice"}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
          <h2 className="font-heading text-lg text-ink">Customer</h2>
          <p className="mt-2 text-ink">{customer?.name}</p>
          <p className="text-ink-muted">{customer?.email}</p>
          <p className="text-ink-muted">{customer?.phone}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 text-sm">
          <h2 className="font-heading text-lg text-ink">Ship to</h2>
          <p className="mt-2 text-ink-muted">{address?.line1}{address?.line2 ? `, ${address.line2}` : ""}</p>
          <p className="text-ink-muted">{address?.city}, {address?.state} {address?.pincode}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-lg text-ink">Items</h2>
        <ul className="mt-3 divide-y divide-border text-sm">
          {(items ?? []).map((it: any) => (
            <li key={it.id} className="flex justify-between gap-3 py-3">
              <span className="text-ink-muted">{it.product_name} &times; {it.qty} <span className="text-ink-muted/60">· HSN {it.hsn_code} @ {it.gst_rate}%</span></span>
              <span className="text-ink">{inr(it.line_total_inr)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
          {order.is_intra_state ? (
            <>
              <div className="flex justify-between text-ink-muted"><dt>CGST</dt><dd>{inr(order.cgst_amount)}</dd></div>
              <div className="flex justify-between text-ink-muted"><dt>SGST</dt><dd>{inr(order.sgst_amount)}</dd></div>
            </>
          ) : (
            <div className="flex justify-between text-ink-muted"><dt>IGST</dt><dd>{inr(order.igst_amount)}</dd></div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-ink"><dt className="font-medium">Total (incl. GST)</dt><dd className="font-medium">{inr(order.grand_total_inr)}</dd></div>
        </dl>
      </div>
    </div>
  );
}
