"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check } from "@phosphor-icons/react";
import { formatInr, type ProductVariant } from "@/lib/catalog";
import { useCart } from "@/lib/cart/CartContext";

// Buy control: variant picker (when a product has >1 active variant) + quantity
// stepper + Add button, plus a mobile sticky bar (doc 03b). Stock status and
// price track the SELECTED variant. Server re-validates everything at checkout.
export default function AddToCart({
  slug,
  name,
  productPrice,
  productStock,
  variants,
  showGst = true,
}: {
  slug: string;
  name: string;
  productPrice: number;
  productStock: number;
  variants: ProductVariant[];
  showGst?: boolean;
}) {
  // Legacy products with no variant rows fall back to a single synthetic option.
  const options: ProductVariant[] =
    variants.length > 0
      ? variants
      : [{ id: "", label: "", priceInr: productPrice, stock: productStock }];
  const hasPicker = options.length > 1;

  const firstInStock = options.findIndex((v) => v.stock > 0);
  const [sel, setSel] = useState(firstInStock >= 0 ? firstInStock : 0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { add } = useCart();
  const variant = options[sel];
  const maxQty = variant.stock;
  const soldOut = maxQty <= 0;
  const clamp = (n: number) => Math.min(Math.max(n, 1), Math.max(maxQty, 1));

  function selectVariant(i: number) {
    setSel(i);
    setQty(1);
    setAdded(false);
  }

  function handleAdd() {
    if (soldOut) return;
    add(
      {
        slug,
        name,
        priceInr: variant.priceInr,
        stock: variant.stock,
        variantId: variant.id || undefined,
        variantLabel: variant.label || undefined,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <>
      {/* selected variant price (authoritative for the buy action) */}
      <p className="mt-5 text-2xl text-ink">
        {formatInr(variant.priceInr)}{" "}
        {showGst ? <span className="text-base text-ink-muted">incl. GST</span> : null}
      </p>

      {hasPicker ? (
        <div className="mt-5">
          <p className="mb-2 text-sm text-ink-muted">Choose an option</p>
          <div className="flex flex-wrap gap-2">
            {options.map((v, i) => {
              const out = v.stock <= 0;
              const active = i === sel;
              return (
                <button
                  key={v.id || v.label}
                  type="button"
                  onClick={() => selectVariant(i)}
                  aria-pressed={active}
                  className={[
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    active
                      ? "border-ink bg-primary text-primary-ink"
                      : "border-border text-ink hover:border-ink-muted",
                    out ? "opacity-50" : "",
                  ].join(" ")}
                >
                  {v.label}
                  {out ? " · sold out" : ""}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

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

      {/* stock status for the selected variant */}
      <p className="mt-4 text-sm text-ink-muted">
        {soldOut
          ? hasPicker
            ? "This option is out of stock."
            : "Currently out of stock."
          : maxQty <= 5
            ? `Only ${maxQty} left${hasPicker ? " in this option" : ""}.`
            : "In stock, ready to ship."}
      </p>

      {/* mobile sticky bar */}
      {!soldOut ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-ink">
              {formatInr(variant.priceInr)}{" "}
              <span className="text-ink-muted">{hasPicker ? variant.label : showGst ? "incl. GST" : ""}</span>
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
