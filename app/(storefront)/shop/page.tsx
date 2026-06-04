import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import ProductCard from "@/components/shop/ProductCard";
import NewsletterBand from "@/components/site/NewsletterBand";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "The full Bugadi collection of oxidised, antique-finish jewellery: ear cuffs, earrings, bracelets, hasli, and pendants.",
};

export default function ShopPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-2 pt-12 sm:px-8 lg:pt-16">
        <h1 className="font-heading text-4xl text-ink lg:text-5xl">Shop all</h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          A considered edit of oxidised, antique-finish pieces. Each one carries
          its motif, its region, and the occasion it belongs to.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-ink-muted hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} trigger="view" delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <NewsletterBand />
    </>
  );
}
