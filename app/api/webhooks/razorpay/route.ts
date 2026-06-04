import { NextResponse, type NextRequest } from "next/server";
import { razorpayProvider } from "@/lib/payments/razorpay";
import { markOrderPaid } from "@/lib/orders";
import { createAdminClient } from "@/lib/supabase/admin";

// Real Razorpay webhook (used when PAYMENT_PROVIDER=razorpay). Verifies the
// HMAC signature on the RAW body, then idempotently marks the matching order
// paid. The ONLY server-trusted path that marks an online order paid.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!razorpayProvider.verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    const rpOrderId = event?.payload?.payment?.entity?.order_id;
    if (rpOrderId) {
      const sb = createAdminClient();
      const { data: order } = await sb
        .from("orders")
        .select("id")
        .eq("razorpay_order_id", rpOrderId)
        .maybeSingle();
      if (order) await markOrderPaid(order.id);
    }
  } catch {
    // malformed payload — already returned 200-safe below
  }

  return NextResponse.json({ ok: true });
}
