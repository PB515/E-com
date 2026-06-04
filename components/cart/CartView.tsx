"use client";

import Link from "next/link";
import { Minus, Plus, Trash, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart/CartContext";
import { formatInr } from "@/lib/catalog";
import ImageSlot from "@/components/ui/ImageSlot";

export default function CartView() {
  const { lines, subtotal, count, ready, changeQty, remove } = useCart();

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
          {lines.map(({ product, qty, lineTotal }) => (
            <li key={product.slug} className="flex gap-4 py-5">
              <Link href={`/product/${product.slug}`} className="shrink-0">
                <ImageSlot className="h-24 w-24" rounded="rounded-xl" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-heading text-lg text-ink hover:text-ink-muted"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-ink-muted">
                      {product.motif} motif, {product.region}
                    </p>
                  </div>
                  <p className="text-sm text-ink">{formatInr(lineTotal)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      type="button"
                      onClick={() => changeQty(product.slug, -1)}
                      className="p-2.5 text-ink disabled:text-ink-muted"
                      aria-label="Decrease quantity"
                      disabled={qty <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums text-ink">{qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(product.slug, 1)}
                      className="p-2.5 text-ink disabled:text-ink-muted"
                      aria-label="Increase quantity"
                      disabled={qty >= product.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(product.slug)}
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
            <div className="flex justify-between text-ink-muted">
              <dt>GST</dt>
              <dd>included</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Shipping</dt>
              <dd>calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-5 flex justify-between border-t border-border pt-5 text-ink">
            <span className="font-medium">Total</span>
            <span className="font-medium">{formatInr(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-ink transition-colors hover:bg-ink"
          >
            Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-4 block text-center text-sm text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
