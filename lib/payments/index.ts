import "server-only";
import type { PaymentProvider } from "@/lib/payments/types";
import { mockProvider } from "@/lib/payments/mock";

/**
 * Picks the active payment provider from PAYMENT_PROVIDER (default "mock").
 * mock  -> the simulated flow, no gateway account needed (now).
 * razorpay -> the real test-mode gateway (later; needs Razorpay keys).
 * The razorpay adapter is imported lazily so a mock-only deploy never needs
 * Razorpay keys present.
 */
export async function getPaymentProvider(): Promise<PaymentProvider> {
  if ((process.env.PAYMENT_PROVIDER || "mock") === "razorpay") {
    const { razorpayProvider } = await import("@/lib/payments/razorpay");
    return razorpayProvider;
  }
  return mockProvider;
}
