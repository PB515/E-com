import "server-only";

/**
 * Shiprocket ADAPTER (doc 05 / billing-gst module). All Shiprocket calls live
 * here. Used BEST-EFFORT by the order flow (wrapped in try/catch) so a shipping
 * failure never blocks an order. Real shipment creation also needs a configured
 * pickup location in the Shiprocket account; until that's set, createOrder may
 * fail and we log it without breaking checkout.
 */
const BASE = "https://apiv2.shiprocket.in/v1/external";

async function authenticate(): Promise<string> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  if (!res.ok) throw new Error(`Shiprocket auth failed (${res.status})`);
  const data = await res.json();
  if (!data.token) throw new Error("Shiprocket auth: no token");
  return data.token as string;
}

export interface ShiprocketOrderInput {
  orderNumber: string;
  orderDateISO: string;
  customerName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; sku: string; units: number; sellingPrice: number }[];
  subTotal: number;
  paymentMethod: "Prepaid" | "COD";
}

export interface ShiprocketResult {
  ok: boolean;
  shipmentId?: number;
  orderId?: number;
  error?: string;
}

export async function createShiprocketOrder(
  input: ShiprocketOrderInput,
): Promise<ShiprocketResult> {
  const token = await authenticate();
  const [firstName, ...rest] = input.customerName.split(" ");
  const res = await fetch(`${BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_id: input.orderNumber,
      order_date: input.orderDateISO.slice(0, 10),
      pickup_location: "Primary",
      billing_customer_name: firstName || input.customerName,
      billing_last_name: rest.join(" ") || ".",
      billing_address: input.line1,
      billing_address_2: input.line2 || "",
      billing_city: input.city,
      billing_pincode: input.pincode,
      billing_state: input.state,
      billing_country: "India",
      billing_email: input.email,
      billing_phone: input.phone,
      shipping_is_billing: true,
      order_items: input.items.map((i) => ({
        name: i.name,
        sku: i.sku,
        units: i.units,
        selling_price: i.sellingPrice,
      })),
      payment_method: input.paymentMethod,
      sub_total: input.subTotal,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.2,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: `Shiprocket create failed (${res.status})` };
  return { ok: true, shipmentId: data.shipment_id, orderId: data.order_id };
}
