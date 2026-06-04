"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { formatInr } from "@/lib/catalog";

// Reads the client cart so checkout is coherent with the bag. Payment + the
// CGST/SGST/IGST split by place-of-supply are wired in Phase 4; here we show
// the GST-inclusive subtotal and a clear "computed at payment" note.
export default function CheckoutSummary() {
  const { lines, subtotal, ready } = useCart();

  return (
    <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
      <h2 className="font-heading text-xl text-ink">Order summary</h2>

      {!ready ? (
        <p className="mt-4 text-sm text-ink-muted">Loading your bag…</p>
      ) : lines.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          Your bag is empty.{" "}
          <Link href="/shop" className="text-primary hover:underline">
            Add a piece
          </Link>{" "}
          to check out.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {lines.map((line) => (
            <li key={line.slug} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-muted">
                {line.name}
                <span className="text-ink-muted/70"> &times; {line.qty}</span>
              </span>
              <span className="text-ink">{formatInr(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
        <div className="flex justify-between text-ink">
          <dt>Subtotal</dt>
          <dd>{ready && lines.length > 0 ? formatInr(subtotal) : "add items"}</dd>
        </div>
        <div className="flex justify-between text-ink-muted">
          <dt>GST (12%)</dt>
          <dd>included, split by state</dd>
        </div>
        <div className="flex justify-between text-ink-muted">
          <dt>Shipping</dt>
          <dd>at payment</dd>
        </div>
      </dl>

      <button
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-full bg-surface-2 px-6 py-3 text-sm font-medium text-ink-muted"
      >
        Pay (test mode), coming next
      </button>
      <p className="mt-3 text-center text-xs text-ink-muted">
        Razorpay test and cash on delivery, wired in the next update. The
        CGST/SGST or IGST split is computed from your state at payment.
      </p>
      <Link
        href="/shop"
        className="mt-4 block text-center text-sm text-primary hover:underline"
      >
        Continue shopping
      </Link>
    </aside>
  );
}
