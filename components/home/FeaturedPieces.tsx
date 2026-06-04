import Link from "next/link";
import { FEATURED, formatInr } from "@/lib/catalog";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";

// Horizontal scroll-snap rail — a different layout family from the category
// grid (skill §4.7 no-repetition). Breadth without a long static list (§4.9).
export default function FeaturedPieces() {
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
          {FEATURED.map((p) => (
            <li
              key={p.slug}
              className="min-w-[260px] shrink-0 snap-start sm:min-w-[300px]"
            >
              <Link href={`/product/${p.slug}`} className="group block">
                <ImageSlot
                  label={p.name}
                  className="aspect-square w-full transition-colors group-hover:border-ink-muted/40"
                />
                <div className="mt-3">
                  <p className="font-heading text-lg text-ink">{p.name}</p>
                  <p className="text-sm text-ink-muted">
                    {p.motif} motif, {p.region}
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {formatInr(p.priceInr)}{" "}
                    <span className="text-ink-muted">incl. GST</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
