import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getHomeCategories } from "@/lib/categories";
import ImageSlot from "@/components/ui/ImageSlot";
import Reveal from "@/components/site/Reveal";

// Admin-managed (DB) categories. The signature 3-then-2 asymmetric layout
// (skill §4.3 / §4.7) is kept when there are exactly 5; any other count falls
// back to a clean uniform grid so the homepage never breaks as categories grow.
const FIVE_LAYOUT = [
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "lg:col-span-2", aspect: "aspect-[4/5]" },
  { span: "col-span-2 lg:col-span-3", aspect: "aspect-[16/10]" },
  { span: "col-span-2 lg:col-span-3", aspect: "aspect-[16/10]" },
];

export default async function CategoryGrid() {
  const categories = await getHomeCategories();
  if (categories.length === 0) return null;
  const useFive = categories.length === 5;
  const gridCols = useFive ? "lg:grid-cols-6" : "lg:grid-cols-3";

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
      <h2 className="font-heading text-3xl text-ink sm:text-4xl">Shop by category</h2>
      <div className={`mt-8 grid grid-cols-2 gap-4 ${gridCols}`}>
        {categories.map((c, i) => {
          const span = useFive ? FIVE_LAYOUT[i].span : "";
          const aspect = useFive ? FIVE_LAYOUT[i].aspect : "aspect-[4/5]";
          return (
            <Reveal key={c.slug} trigger="view" delay={(i % 6) * 0.05} className={span}>
              <Link href={`/category/${c.slug}`} className="group block focus-visible:outline-none">
                <ImageSlot
                  label={c.name}
                  src={c.imageUrl}
                  alt={c.name}
                  className={`${aspect} w-full transition-colors group-hover:border-ink-muted/40`}
                />
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-heading text-xl text-ink">{c.name}</span>
                  <ArrowRight size={18} className="text-ink-muted transition-transform group-hover:translate-x-1" />
                </div>
                {c.blurb ? <p className="text-sm text-ink-muted">{c.blurb}</p> : null}
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
