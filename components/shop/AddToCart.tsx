"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check } from "@phosphor-icons/react";
import { formatInr } from "@/lib/catalog";
import { useCart } from "@/lib/cart/CartContext";

// Buy control: quantity stepper + Add button, plus a mobile sticky bar
// (doc 03b — sticky add-to-cart on mobile). Phase 3: adds to the client cart.
export default function AddToCart({
  slug,
  priceInr,
  soldOut,
  maxQty,
}: {
  slug: string;
  priceInr: number;
  soldOut: boolean;
  maxQty: number;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const clamp = (n: number) => Math.min(Math.max(n, 1), Math.max(maxQty, 1));

  function handleAdd() {
    add(slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      {/* inline control (buy panel) */}
      <div className="mt-6">
        {soldOut ? (
          <p className="rounded-full border border-border bg-surface px-5 py-3 text-center text-sm text-ink-muted">
            Sold out
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => clamp(q - 1))}
                className="p-3 text-ink disabled:text-ink-muted"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm tabular-nums text-ink">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => clamp(q + 1))}
                className="p-3 text-ink disabled:text-ink-muted"
                aria-label="Increase quantity"
                disabled={qty >= maxQty}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-ink transition-colors hover:bg-ink active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {added ? <Check size={16} /> : null}
              {added ? "Added" : "Add to bag"}
            </button>
          </div>
        )}
        {added ? (
          <p className="mt-3 text-sm text-primary" role="status">
            Added to your bag.{" "}
            <Link href="/cart" className="underline underline-offset-2">
              View bag
            </Link>
          </p>
        ) : null}
      </div>

      {/* mobile sticky bar */}
      {!soldOut ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-ink">
              {formatInr(priceInr)}{" "}
              <span className="text-ink-muted">incl. GST</span>
            </span>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-ink active:translate-y-px"
            >
              {added ? "Added" : "Add to bag"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
