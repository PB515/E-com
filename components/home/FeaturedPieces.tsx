import Link from "next/link";
import { getFeatured } from "@/lib/products";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/site/Reveal";

// Horizontal scroll-snap rail — a different layout family from the category
// grid (skill §4.7 no-repetition). Reads featured products from the database.
export default async function FeaturedPieces() {
  const featured = await getFeatured();
  if (featured.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between px-5 sm:px-8">
        <h2 className="font-heading text-3xl text-ink sm:text-4xl">A considered edit</h2>
        <Link
          href="/shop"
          className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          View all
        </Link>
      </div>

      <Reveal trigger="view">
        <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((p) => (
            <li
              key={p.slug}
              className="min-w-[260px] shrink-0 snap-start sm:min-w-[300px]"
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
