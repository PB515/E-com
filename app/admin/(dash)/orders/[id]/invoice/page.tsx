import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/catalog";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";
const inr = (v: unknown) => formatInr(Number(v));

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = await createClient();
  const { data: order } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();

  const [{ data: customer }, { data: address }, { data: items }, { data: invoice }, { data: tax }] =
    await Promise.all([
      sb.from("customers").select("*").eq("id", order.customer_id).maybeSingle(),
      sb.from("addresses").select("*").eq("id", order.address_id).maybeSingle(),
      sb.from("order_items").select("*").eq("order_id", id),
      sb.from("invoices").select("*").eq("order_id", id).maybeSingle(),
      sb.from("tax_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
  if (!invoice) notFound();

  const issued = new Date(invoice.issued_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const taxable = Number(order.subtotal_inr) - Number(order.total_tax_amount);

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href={`/admin/orders/${id}`} className="text-sm text-ink-muted hover:text-ink">← Order</Link>
        <PrintButton />
      </div>

      {/* DOCUMENT — light, print-friendly */}
      <div className="mx-auto max-w-[800px] rounded-lg bg-white p-10 text-zinc-900 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{tax?.business_name ?? "Bugadi"}</h1>
            <p className="text-sm text-zinc-600">Oxidised Indian jewellery</p>
            {tax?.gstin ? <p className="mt-1 text-sm">GSTIN: {tax.gstin}</p> : <p className="mt-1 text-sm text-zinc-500">GSTIN: (to be added)</p>}
            <p className="text-sm">State: {tax?.registered_state}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">TAX INVOICE</p>
            <p className="text-sm">{invoice.invoice_number}</p>
            <p className="text-sm text-zinc-600">{issued}</p>
            <p className="text-sm text-zinc-600">Order {order.order_number}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium text-zinc-500">Bill to</p>
            <p className="mt-1">{customer?.name}</p>
            <p className="text-zinc-600">{customer?.email}</p>
            <p className="text-zinc-600">{customer?.phone}</p>
          </div>
          <div>
            <p className="font-medium text-zinc-500">Ship to</p>
            <p className="mt-1">{address?.line1}{address?.line2 ? `, ${address.line2}` : ""}</p>
            <p className="text-zinc-600">{address?.city}, {address?.state} {address?.pincode}</p>
            <p className="text-zinc-600">Place of supply: {order.place_of_supply_state}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-300 text-left">
              <th className="py-2">Item</th>
              <th className="py-2">HSN</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((it: any) => (
              <tr key={it.id} className="border-b border-zinc-200">
                <td className="py-2">{it.product_name}</td>
                <td className="py-2">{it.hsn_code}</td>
                <td className="py-2 text-right">{it.qty}</td>
                <td className="py-2 text-right">{inr(it.unit_price_inr)}</td>
                <td className="py-2 text-right">{inr(it.line_total_inr)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="w-64 text-sm">
            <div className="flex justify-between py-1"><dt className="text-zinc-600">Taxable value</dt><dd>{inr(taxable)}</dd></div>
            {order.is_intra_state ? (
              <>
                <div className="flex justify-between py-1"><dt className="text-zinc-600">CGST</dt><dd>{inr(order.cgst_amount)}</dd></div>
                <div className="flex justify-between py-1"><dt className="text-zinc-600">SGST</dt><dd>{inr(order.sgst_amount)}</dd></div>
              </>
            ) : (
              <div className="flex justify-between py-1"><dt className="text-zinc-600">IGST</dt><dd>{inr(order.igst_amount)}</dd></div>
            )}
            <div className="mt-1 flex justify-between border-t-2 border-zinc-300 pt-2 font-semibold"><dt>Total (incl. GST)</dt><dd>{inr(order.grand_total_inr)}</dd></div>
          </dl>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Prices are inclusive of GST. Payment: {order.payment_method === "cod" ? "Cash on delivery" : "Online (test mode)"}.
          This is a computer-generated invoice.
        </p>

        {/* Packing slip — new page when printed */}
        <div className="mt-12 border-t-2 border-dashed border-zinc-300 pt-10" style={{ breakBefore: "page" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Packing slip</h2>
            <p className="text-sm text-zinc-600">{order.order_number}</p>
          </div>
          <p className="mt-3 text-sm">{customer?.name}</p>
          <p className="text-sm text-zinc-600">{address?.line1}{address?.line2 ? `, ${address.line2}` : ""}, {address?.city}, {address?.state} {address?.pincode}</p>
          <table className="mt-6 w-full text-sm">
            <thead><tr className="border-b-2 border-zinc-300 text-left"><th className="py-2">Item</th><th className="py-2 text-right">Qty</th></tr></thead>
            <tbody>
              {(items ?? []).map((it: any) => (
                <tr key={it.id} className="border-b border-zinc-200"><td className="py-2">{it.product_name}</td><td className="py-2 text-right">{it.qty}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
