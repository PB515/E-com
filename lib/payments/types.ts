// Payment adapter boundary (doc 05 / billing-gst module). The checkout and the
// confirmation webhook talk ONLY to this interface, never to a provider SDK
// directly. Swapping mock -> razorpay -> stripe later means implementing this
// interface once; the store, checkout, invoices, and history never change.

export interface CreateOrderArgs {
  /** our internal order id / number */
  orderRef: string;
  /** amount in the smallest unit (paise) */
  amountInPaise: number;
}

export interface CreatedProviderOrder {
  providerOrderId: string;
}

export interface PaymentProvider {
  readonly name: "mock" | "razorpay";
  /** create a payment order with the provider (or a simulated one) */
  createOrder(args: CreateOrderArgs): Promise<CreatedProviderOrder>;
  /**
   * Verify the authenticity of a confirmation/webhook payload server-side.
   * This is the ONLY thing allowed to mark an order paid, and callers must make
   * the mark-paid write idempotent (ignore duplicate/late confirmations).
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
}
