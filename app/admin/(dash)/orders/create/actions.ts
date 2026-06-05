"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertCustomer, finalizeOrder } from "@/lib/orders";
import { computeGstFromInclusive, DEFAULT_GST_RATE } from "@/lib/tax";
import { logAdminAction } from "@/lib/audit";

export interface ManualLine {
  productId: string;
  variantId: string;
  qty: number;
  unitPriceInr: number;
}
export interface ManualOrderInput {
  customer: { name: string; phone: string; email: string };
  address: { line1: string; line2?: string; city: string; state: string; pincode: string };
  items: ManualLine[];
  discountInr: number;
  shippingInr: number;
  paymentMethod: "upi" | "cod" | "cash" | "bank" | "marketplace";
  paymentStatus: "paid" | "pending" | "partial";
  source: string;
  marketplaceName?: string;
  marketplaceOrderId?: string;
  marketplaceFeeInr?: number;
  internalNote?: string;
  isDraft: boolean;
}

function n(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function createManualOrder(input: ManualOrderInput) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };

  if (!n(input.customer?.name) || !n(input.customer?.phone)) return { error: "Customer name and phone are required." };
  if (!n(input.address?.state)) return { error: "State is required (for the GST split)." };
  const items = (input.items ?? []).filter((l) => l.productId && l.variantId && l.qty > 0);
  if (items.length === 0) return { error: "Add at least one line item." };

  const sb = createAdminClient();

  // authoritative product/variant data (snapshot)
  const productIds = [...new Set(items.map((i) => i.productId))];
  const { data: products } = await sb.from("products").select("id,name,hsn_code,gst_rate,price_inr").in("id", productIds);
  const { data: variants } = await sb.from("product_variants").select("id,label,product_id").in("id", items.map((i) => i.variantId));

  const lines = items.map((l) => {
    const p = products?.find((x: any) => x.id === l.productId);
    const v = variants?.find((x: any) => x.id === l.variantId);
    const unit = Math.max(0, Math.round(l.unitPriceInr || p?.price_inr || 0));
    return { p, v, qty: Math.max(1, Math.floor(l.qty)), unit, lineTotal: unit * Math.max(1, Math.floor(l.qty)) };
  }).filter((l): l is { p: any; v: any; qty: number; unit: number; lineTotal: number } => Boolean(l.p && l.v));
  if (lines.length === 0) return { error: "No valid line items." };

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const discount = Math.max(0, Math.round(input.discountInr || 0));
  const shipping = Math.max(0, Math.round(input.shippingInr || 0));
  const net = Math.max(0, subtotal - discount);

  const { data: tax } = await sb.from("tax_settings").select("registered_state,default_gst_rate").eq("id", 1).maybeSingle();
  const sellerState = tax?.registered_state ?? "Maharashtra";
  const rate = Number(tax?.default_gst_rate ?? DEFAULT_GST_RATE);
  const gst = computeGstFromInclusive(net, rate, input.address.state, sellerState);
  const grandTotal = net + shipping;

  const cust = await upsertCustomer(sb, { ...input.customer, source: input.source });
  if (!cust) return { error: "Could not save customer." };
  const { data: addr } = await sb.from("addresses").insert({
    customer_id: cust.id, line1: input.address.line1, line2: input.address.line2 ?? null,
    city: input.address.city, state: input.address.state, pincode: input.address.pincode,
  }).select("id").single();
  if (!addr) return { error: "Could not save address." };

  const status = input.isDraft ? "pending" : input.paymentStatus === "paid" ? "paid" : "cod_confirmed";
  const { data: order, error: orderErr } = await sb.from("orders").insert({
    customer_id: cust.id, address_id: addr.id, status,
    source: input.source, is_draft: input.isDraft,
    payment_method: input.paymentMethod, payment_status: input.paymentStatus,
    discount_inr: discount, shipping_inr: shipping,
    marketplace_name: input.marketplaceName ?? null,
    marketplace_order_id: input.marketplaceOrderId ?? null,
    marketplace_fee_inr: Math.max(0, Math.round(input.marketplaceFeeInr || 0)),
    internal_note: input.internalNote ?? null,
    place_of_supply_state: input.address.state, is_intra_state: gst.isIntraState,
    subtotal_inr: net, cgst_amount: gst.cgst, sgst_amount: gst.sgst, igst_amount: gst.igst,
    total_tax_amount: gst.totalTax, grand_total_inr: grandTotal,
  }).select("*").single();
  if (orderErr || !order) return { error: orderErr?.message ?? "Could not create order." };

  await sb.from("order_items").insert(lines.map((l) => ({
    order_id: order.id, product_id: l.p.id, product_name: l.p.name,
    unit_price_inr: l.unit, qty: l.qty, hsn_code: l.p.hsn_code, gst_rate: l.p.gst_rate,
    line_total_inr: l.lineTotal, variant_id: l.v.id, variant_label: l.v.label,
  })));

  // confirmed (non-draft) orders deduct stock + create the invoice now
  if (!input.isDraft) await finalizeOrder(order.id);

  await logAdminAction("order.manual_create", "order", order.id, { source: input.source, draft: input.isDraft });
  revalidatePath("/admin/orders");
  return { ok: true as const, orderId: order.id };
}
