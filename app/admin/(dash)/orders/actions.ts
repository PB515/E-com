"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createShiprocketOrder } from "@/lib/shipping/shiprocket";

export type OrderStatus =
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  opts?: { tracking?: string; courier?: string },
) {
  const sb = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "shipped") {
    patch.shipped_at = new Date().toISOString();
    if (opts?.tracking) patch.tracking_number = opts.tracking.trim();
    if (opts?.courier) patch.courier = opts.courier.trim();
  }
  if (status === "delivered") patch.delivered_at = new Date().toISOString();

  const { error } = await sb.from("orders").update(patch).eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true as const };
}

// Manual "Push to Shiprocket" — admin-verified, then service-role reads + the
// adapter call (best-effort; needs a configured pickup location to succeed).
export async function pushToShiprocket(orderId: string) {
  const supa = await createClient();
  const { data: isAdmin } = await supa.rpc("is_admin");
  if (!isAdmin) return { error: "Not authorized." };

  const sb = createAdminClient();
  const { data: order } = await sb.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return { error: "Order not found." };
  const [{ data: cust }, { data: addr }, { data: items }] = await Promise.all([
    sb.from("customers").select("*").eq("id", order.customer_id).maybeSingle(),
    sb.from("addresses").select("*").eq("id", order.address_id).maybeSingle(),
    sb.from("order_items").select("*").eq("order_id", orderId),
  ]);
  if (!cust || !addr || !items) return { error: "Order data incomplete." };

  try {
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
    if (!r.ok) return { error: r.error ?? "Shiprocket rejected the order." };
    if (r.shipmentId) await sb.from("orders").update({ shiprocket_shipment_id: String(r.shipmentId) }).eq("id", orderId);
    revalidatePath(`/admin/orders/${orderId}`);
    return { ok: true as const, shipmentId: r.shipmentId };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Shiprocket push failed." };
  }
}
