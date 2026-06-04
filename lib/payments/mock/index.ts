import "server-only";
import { createHmac } from "node:crypto";
import type {
  CreateOrderArgs,
  CreatedProviderOrder,
  PaymentProvider,
} from "@/lib/payments/types";

/**
 * MOCK payment provider. Runs the real shape of the flow with no gateway:
 *  - createOrder returns a deterministic mock order id,
 *  - sign() produces a valid signature for the "Simulate payment" step,
 *  - verifyWebhookSignature validates it with an HMAC, exactly like the real
 *    webhook would, so the idempotent mark-paid path is exercised honestly.
 * No card data, no real money. Swap PAYMENT_PROVIDER=razorpay later.
 */
const SECRET = process.env.MOCK_PAYMENT_SECRET || "mock-dev-secret";

function hmac(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export const mockProvider: PaymentProvider = {
  name: "mock",

  async createOrder({ orderRef, amountInPaise }: CreateOrderArgs): Promise<CreatedProviderOrder> {
    return { providerOrderId: `mock_${orderRef}_${amountInPaise}` };
  },

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const expected = hmac(rawBody);
    // constant-ish comparison; lengths equal for hex of same algo
    return expected === signature;
  },
};

/** Used by the "Simulate payment success" action to forge a valid signature. */
export function signMockWebhook(rawBody: string): string {
  return hmac(rawBody);
}
