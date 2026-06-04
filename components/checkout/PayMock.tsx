"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { payMockAction } from "@/app/(storefront)/checkout/actions";

// Stand-in for the gateway-hosted checkout. "Pay now" calls the server, which
// idempotently marks the order paid (the same path the real Razorpay webhook
// will use). No card fields, no real money.
export default function PayMock({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function pay() {
    setBusy(true);
    setFailed(false);
    const r = await payMockAction(orderId);
    if (r.ok) {
      router.push(`/order/${orderId}`);
    } else {
      setBusy(false);
      setFailed(true);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">Test payment</p>
      <h1 className="mt-2 font-heading text-3xl text-ink">Confirm your payment</h1>
      <p className="mt-3 text-sm text-ink-muted">
        This is a simulated gateway. No real money moves. Choose an outcome to
        test the flow end to end.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={pay}
          disabled={busy}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-colors hover:bg-ink disabled:opacity-60"
        >
          {busy ? "Confirming…" : "Pay now (simulate success)"}
        </button>
        <button
          type="button"
          onClick={() => setFailed(true)}
          disabled={busy}
          className="rounded-full border border-border px-6 py-3 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Simulate failure
        </button>
      </div>
      {failed ? (
        <p className="mt-5 text-sm text-error" role="alert">
          Payment did not go through. Your order is held.{" "}
          <Link href="/cart" className="underline underline-offset-2">
            Back to bag
          </Link>
        </p>
      ) : null}
    </div>
  );
}
