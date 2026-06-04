/**
 * Razorpay ADAPTER BOUNDARY (doc 05 / billing-gst module).
 * ALL Razorpay calls live behind this module — never scattered through the
 * codebase. Switching gateway later = rewrite only this adapter.
 *
 * Rules carried in (Phase 4):
 *  - TEST MODE keys (rzp_test_…) from env, SERVER-SIDE only.
 *  - Hosted checkout → card data NEVER touches our server.
 *  - The webhook is the ONLY thing that marks an order paid, and is IDEMPOTENT.
 */

export interface PaymentAdapter {
  createOrder(args: {
    amountInPaise: number;
    receipt: string;
  }): Promise<{ providerOrderId: string }>;
  verifyWebhook(rawBody: string, signature: string): boolean;
}

// TODO (Phase 4): implement against the Razorpay SDK using env keys by name only.
export const razorpay = {} as Partial<PaymentAdapter>;
