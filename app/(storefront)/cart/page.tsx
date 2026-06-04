import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Your bag" };

// Phase 2 ships the empty state (one of the required states, doc 03/10).
// The live cart with line items + summary is wired in Phase 3 (client cart).
export default function CartPage() {
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
