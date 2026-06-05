"use client";

import Link from "next/link";
import { Minus, Plus, Trash, ShoppingBag, WhatsappLogo } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart/CartContext";
import { formatInr } from "@/lib/catalog";
import { gstIncludedInTotal, DEFAULT_GST_RATE } from "@/lib/tax";
import { cartLink } from "@/lib/whatsapp";
import ImageSlot from "@/components/ui/ImageSlot";

const STEPS = [
  { n: "1", title: "Add products to your bag", body: "Choose the pieces you love." },
  { n: "2", title: "Send order on WhatsApp", body: "Your cart details are shared with us instantly." },
  { n: "3", title: "Confirm payment", body: "We share UPI QR / payment details." },
  { n: "4", title: "We pack and ship", body: "Once payment is confirmed, your order ships across India." },
];

export default function CartView({ showGst = true }: { showGst?: boolean }) {
  const { lines, subtotal, count, ready, changeQty, remove } = useCart();
  const gst = gstIncludedInTotal(subtotal, DEFAULT_GST_RATE);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-24 text-center sm:px-8">
        <p className="text-ink-muted">Loading your bag…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[760px] flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <ShoppingBag size={40} weight="thin" className="text-ink-muted" />
        <h1 className="mt-5 font-heading text-3xl text-ink">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-ink-muted">
          Nothing here yet. Browse the collection and add a piece you love.
        </p>
        <Link
          href="/shop"
          className="mt-7 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-colors hover:bg-ink"
        >
          Shop the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
      <h1 className="font-heading text-4xl text-ink lg:text-5xl">Your bag</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {count} item{count === 1 ? "" : "s"}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        {/* Lines */}
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={line.lineId} className="flex gap-4 py-5">
              <Link href={`/product/${line.slug}`} className="shrink-0">
                <ImageSlot className="h-24 w-24" rounded="rounded-xl" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${line.slug}`}
                      className="font-heading text-lg text-ink hover:text-ink-muted"
                    >
                      {line.name}
                    </Link>
                    {line.variantLabel && line.variantLabel !== "Standard" ? (
                      <p className="mt-0.5 text-sm text-ink-muted">{line.variantLabel}</p>
                    ) : null}
                  </div>
                  <p className="text-sm text-ink">{formatInr(line.lineTotal)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => changeQty(line.lineId, -1)}
                      className="p-2.5 text-ink disabled:text-ink-muted"
                      aria-label="Decrease quantity"
                      disabled={line.qty <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums text-ink">{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(line.lineId, 1)}
                      className="p-2.5 text-ink disabled:text-ink-muted"
                      aria-label="Increase quantity"
                      disabled={line.qty >= line.maxStock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.lineId)}
                    className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    <Trash size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
          <h2 className="font-heading text-xl text-ink">Summary</h2>
          <dl className="mt-5 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink">
              <dt>Subtotal</dt>
              <dd>{formatInr(subtotal)}</dd>
            </div>
            {showGst ? (
              <div className="flex justify-between text-ink-muted">
                <dt>GST ({DEFAULT_GST_RATE}%, incl.)</dt>
                <dd>{formatInr(gst)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-ink-muted">
              <dt>Shipping</dt>
              <dd>calculated at checkout</dd>
            </div>
          </dl>
          {showGst ? (
            <p className="mt-3 text-xs text-ink-muted/80">
              GST is included in the price. The CGST/SGST or IGST split is set by
              your shipping state at checkout.
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-muted/80">
              GST is not charged as the seller is not currently registered under GST.
            </p>
          )}
          <div className="mt-5 flex justify-between border-t border-border pt-5 text-ink">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatInr(subtotal)}</span>
          </div>
          <a
            href={cartLink(lines.map((l) => ({ name: l.name, variantLabel: l.variantLabel, qty: l.qty, lineTotal: l.lineTotal })), subtotal)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-ink transition-colors hover:bg-ink"
          >
            <WhatsappLogo size={18} weight="fill" />
            Send Cart on WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-ink-muted/80">
            UPI QR / payment details are shared after you message us. UPI checkout coming soon.
          </p>
          <Link
            href="/shop"
            className="mt-4 block text-center text-sm text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>

      {/* How ordering works */}
      <div className="mt-14 rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10">
        <h2 className="font-heading text-2xl text-ink">How ordering works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm text-ink">{s.n}</span>
              <p className="text-sm font-medium text-ink">{s.title}</p>
              <p className="text-sm text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
