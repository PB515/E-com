import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeGstFromInclusive, DEFAULT_GST_RATE } from "@/lib/tax";
import { sendOrderConfirmation } from "@/lib/email";
import { createShiprocketOrder } from "@/lib/shipping/shiprocket";
import { applyStockMovement, defaultVariant } from "@/lib/stock";

export interface CheckoutItem {
  slug: string;
  qty: number;
}
export interface CheckoutInput {
  items: CheckoutItem[];
  customer: { name: string; email: string; phone: string };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "online" | "cod";
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  status: string;
  grandTotal: number;
  paymentMethod: "online" | "cod";
}

// CRM dedupe: find an existing customer by phone (last 10 digits) or email,
// reuse it; else create. Source is only set when creating. Used by the website
// checkout and (later) manual order creation.
export async function upsertCustomer(
  sb: ReturnType<typeof createAdminClient>,
  c: { name: string; email: string; phone: string; source?: string },
): Promise<{ id: string } | null> {
  const phone10 = (c.phone || "").replace(/\D/g, "").slice(-10);
  const email = (c.email || "").trim().toLowerCase();

  let existing: { id: string } | null = null;
  if (phone10) {
    const { data } = await sb.from("customers").select("id").ilike("phone", `%${phone10}`).limit(1).maybeSingle();
    existing = data;
  }
  if (!existing && email) {
    const { data } = await sb.from("customers").select("id").eq("email", email).limit(1).maybeSingle();
    existing = data;
  }
  if (existing) {
    await sb.from("customers").update({ name: c.name }).eq("id", existing.id);
    return existing;
  }
  const { data } = await sb
    .from("customers")
    .insert({ name: c.name, email, phone: c.phone, source: c.source ?? null })
    .select("id")
    .single();
  return data ?? null;
}

// Re-reads authoritative price/stock from the DB (never trusts client prices),
// computes place-of-supply GST, writes customer/address/order/order_items with
// the tax snapshot. COD finalizes immediately; online is left pending for the
// payment confirmation to mark paid.
export async function createOrder(
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const sb = createAdminClient();

  const slugs = input.items.map((i) => i.slug);
  const { data: products } = await sb
    .from("products")
    .select("*")
    .in("slug", slugs)
    .eq("is_active", true);
  if (!products || products.length === 0) throw new Error("No valid products in cart");

  const lines = input.items
    .map((it) => {
      const p = products.find((x: { slug: string }) => x.slug === it.slug);
      if (!p || p.stock <= 0) return null;
      const qty = Math.max(1, Math.min(it.qty, p.stock));
      return { p, qty, lineTotal: p.price_inr * qty };
    })
    .filter((l): l is { p: any; qty: number; lineTotal: number } => l !== null);
  if (lines.length === 0) throw new Error("No purchasable items in cart");

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const { data: tax } = await sb
    .from("tax_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  const sellerState = tax?.registered_state ?? "Maharashtra";
  const rate = Number(tax?.default_gst_rate ?? DEFAULT_GST_RATE);
  const gst = computeGstFromInclusive(subtotal, rate, input.address.state, sellerState);

  // CRM dedupe: reuse an existing customer (by phone, then email) so repeat
  // buyers build one profile; otherwise create a new one stamped with source.
  const cust = await upsertCustomer(sb, {
    name: input.customer.name,
    email: input.customer.email,
    phone: input.customer.phone,
    source: "website",
  });
  if (!cust) throw new Error("Could not save customer");

  const { data: addr, error: addrErr } = await sb
    .from("addresses")
    .insert({
      customer_id: cust.id,
      line1: input.address.line1,
      line2: input.address.line2 ?? null,
      city: input.address.city,
      state: input.address.state,
      pincode: input.address.pincode,
    })
    .select("id")
    .single();
  if (addrErr || !addr) throw new Error("Could not save address");

  const status = input.paymentMethod === "cod" ? "cod_confirmed" : "pending";
  const { data: order, error: orderErr } = await sb
    .from("orders")
    .insert({
      customer_id: cust.id,
      address_id: addr.id,
      status,
      source: "website",
      payment_method: input.paymentMethod === "cod" ? "cod" : "razorpay",
      payment_status: input.paymentMethod === "cod" ? "pending" : "paid",
      place_of_supply_state: input.address.state,
      is_intra_state: gst.isIntraState,
      subtotal_inr: subtotal,
      cgst_amount: gst.cgst,
      sgst_amount: gst.sgst,
      igst_amount: gst.igst,
      total_tax_amount: gst.totalTax,
      grand_total_inr: gst.grandTotal,
    })
    .select("*")
    .single();
  if (orderErr || !order) throw new Error("Could not create order");

  // attach the default variant per line (the storefront sells at product level
  // until the variant picker ships; multi-variant products default to variant 1)
  const itemsToInsert = [];
  for (const l of lines) {
    const v = await defaultVariant(sb, l.p.id);
    itemsToInsert.push({
      order_id: order.id,
      product_id: l.p.id,
      product_name: l.p.name,
      unit_price_inr: l.p.price_inr,
      qty: l.qty,
      hsn_code: l.p.hsn_code,
      gst_rate: l.p.gst_rate,
      line_total_inr: l.lineTotal,
      variant_id: v?.id ?? null,
      variant_label: v?.label ?? null,
    });
  }
  await sb.from("order_items").insert(itemsToInsert);

  if (input.paymentMethod === "cod") {
    await finalizeOrder(order.id);
  }

  return {
    orderId: order.id,
    orderNumber: order.order_number,
    status,
    grandTotal: gst.grandTotal,
    paymentMethod: input.paymentMethod,
  };
}

// IDEMPOTENT: transition a pending order to paid exactly once, then finalize.
// The conditional update (.eq status pending) makes duplicate/late calls safe.
export async function markOrderPaid(
  orderId: string,
): Promise<{ ok: boolean; already?: boolean }> {
  const sb = createAdminClient();
  const { data: order } = await sb
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false };
  if (order.status === "paid") return { ok: true, already: true };
  if (order.status !== "pending") return { ok: false };

  const { data: updated } = await sb
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id");
  if (!updated || updated.length === 0) return { ok: true, already: true };

  await finalizeOrder(orderId);
  return { ok: true };
}

// Creates the invoice (idempotent) + decrements variant stock + best-effort
// side effects (email, shipping). Exported so manual orders reuse it.
export async function finalizeOrder(orderId: string): Promise<void> {
  const sb = createAdminClient();
  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return;

  // invoice (skip if exists — idempotent)
  const { data: existing } = await sb
    .from("invoices")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();
  if (!existing) {
    const { data: ts } = await sb
      .from("tax_settings")
      .select("gstin")
      .eq("id", 1)
      .maybeSingle();
    await sb.from("invoices").insert({
      invoice_number: "INV-" + order.order_number,
      order_id: order.id,
      gstin: ts?.gstin ?? null,
      place_of_supply_state: order.place_of_supply_state,
      is_intra_state: order.is_intra_state,
      subtotal_inr: order.subtotal_inr,
      cgst_amount: order.cgst_amount,
      sgst_amount: order.sgst_amount,
      igst_amount: order.igst_amount,
      total_tax_amount: order.total_tax_amount,
      grand_total_inr: order.grand_total_inr,
    });
  }

  // Decrement variant stock via the ledger — one pool, logged, no overselling.
  // Runs once per order (finalizeOrder only fires on the pending->paid / cod
  // transition). The product mirror (products.stock) is recomputed inside.
  const { data: stockItems } = await sb
    .from("order_items")
    .select("product_id,variant_id,qty")
    .eq("order_id", orderId);
  for (const it of stockItems ?? []) {
    const variantId = it.variant_id ?? (await defaultVariant(sb, it.product_id))?.id;
    if (variantId) {
      await applyStockMovement(sb, {
        variantId,
        productId: it.product_id,
        delta: -Number(it.qty),
        reason: "sale",
        source: order.source ?? "website",
        orderId,
      });
    }
  }

  // best-effort side effects — never block the order
  const { data: cust } = await sb
    .from("customers")
    .select("name,email,phone")
    .eq("id", order.customer_id)
    .maybeSingle();

  if (cust?.email) {
    try {
      await sendOrderConfirmation({
        to: cust.email,
        orderNumber: order.order_number,
        grandTotalInr: Number(order.grand_total_inr),
        paymentMethod: order.payment_method,
      });
    } catch (e) {
      console.error("order email failed", e);
    }
  }

  try {
    const { data: addr } = await sb
      .from("addresses")
      .select("*")
      .eq("id", order.address_id)
      .maybeSingle();
    const { data: items } = await sb
      .from("order_items")
      .select("product_name,product_id,qty,unit_price_inr")
      .eq("order_id", orderId);
    if (addr && items && cust) {
      const r = await createShiprocketOrder({
        orderNumber: order.order_number,
        orderDateISO: order.created_at,
        customerName: cust.name,
        email: cust.email,
        phone: cust.phone ?? "",
        line1: addr.line1,
        line2: addr.line2 ?? "",
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        items: items.map((i: any) => ({
          name: i.product_name,
          sku: i.product_id,
          units: i.qty,
          sellingPrice: Number(i.unit_price_inr),
        })),
        subTotal: Number(order.subtotal_inr),
        paymentMethod: order.payment_method === "cod" ? "COD" : "Prepaid",
      });
      if (!r.ok) console.error("shiprocket:", r.error);
    }
  } catch (e) {
    console.error("shiprocket push failed", e);
  }
}

// Read an order for its confirmation page (by non-enumerable uuid).
export async function getOrderForConfirmation(orderId: string) {
  const sb = createAdminClient();
  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return null;
  const { data: items } = await sb
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  return { order, items: items ?? [] };
}
