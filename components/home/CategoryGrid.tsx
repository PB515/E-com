import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/lib/catalog";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";

// Asymmetric 3-then-2 layout (skill §4.3 / §4.7): top row three narrow tiles,
// bottom row two wide tiles. Five items, five cells, no empty cell.
const layout = [
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "col-span-2 lg:col-span-3", aspect: "aspect-[16/10]" },
  { span: "col-span-2 lg:col-span-3", aspect: "aspect-[16/10]" },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
      <h2 className="font-heading text-3xl text-ink sm:text-4xl">Shop by category</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.slug} trigger="view" delay={i * 0.05} className={layout[i].span}>
            <Link
              href={`/category/${c.slug}`}
              className="group block focus-visible:outline-none"
            >
              <ImageSlot
                label={c.name}
                className={`${layout[i].aspect} w-full transition-colors group-hover:border-ink-muted/40`}
              />
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-heading text-xl text-ink">{c.name}</span>
                <ArrowRight
                  size={18}
                  className="text-ink-muted transition-transform group-hover:translate-x-1"
                />
              </div>
              <p className="text-sm text-ink-muted">{c.blurb}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
