import "server-only";
import { createHmac } from "node:crypto";
import Razorpay from "razorpay";
import type {
  CreateOrderArgs,
  CreatedProviderOrder,
  PaymentProvider,
} from "@/lib/payments/types";

/**
 * Razorpay ADAPTER (the later swap; PAYMENT_PROVIDER=razorpay). All Razorpay
 * calls live here, behind the same PaymentProvider interface as the mock.
 *  - TEST MODE keys (rzp_test_...) from env, server-side only.
 *  - Hosted checkout -> card data NEVER touches our server.
 *  - verifyWebhookSignature is HMAC-SHA256 over the raw body with the webhook
 *    secret; the caller marks the order paid idempotently.
 * Not exercised until the founder adds Razorpay test keys + a webhook.
 */
function client(): Razorpay {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export const razorpayProvider: PaymentProvider = {
  name: "razorpay",

  async createOrder({ orderRef, amountInPaise }: CreateOrderArgs): Promise<CreatedProviderOrder> {
    const order = await client().orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderRef,
    });
    return { providerOrderId: order.id };
  },

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const expected = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
      .update(rawBody)
      .digest("hex");
    return expected === signature;
  },
};
