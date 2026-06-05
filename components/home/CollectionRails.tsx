import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getHomeCollections, getCollectionProducts } from "@/lib/collections";
import { getPublicTaxMode } from "@/lib/tax-settings";
import ProductCard from "@/components/shop/ProductCard";
import Reveal from "@/components/site/Reveal";

// Admin-curated marketing rails on the homepage. Each "show on home" collection
// renders as a titled product row; renders nothing if there are none. Capped to
// keep the homepage tight.
export default async function CollectionRails() {
  const collections = (await getHomeCollections()).slice(0, 2);
  if (collections.length === 0) return null;
  const showGst = (await getPublicTaxMode()) === "gst";

  const rails = await Promise.all(
    collections.map(async (c) => ({ c, products: await getCollectionProducts(c.slug, 4) })),
  );

  return (
    <>
      {rails.map(({ c, products }) =>
        products.length === 0 ? null : (
          <section key={c.slug} className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:py-16">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl text-ink sm:text-4xl">{c.title}</h2>
                {c.description ? <p className="mt-2 max-w-xl text-sm text-ink-muted">{c.description}</p> : null}
              </div>
              <Link href={`/collection/${c.slug}`} className="hidden shrink-0 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink sm:flex">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
              {products.map((p, i) => (
                <Reveal key={p.slug} trigger="view" delay={(i % 4) * 0.05}>
                  <ProductCard product={p} showGst={showGst} />
                </Reveal>
              ))}
            </div>
            <Link href={`/collection/${c.slug}`} className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline sm:hidden">
              View all <ArrowRight size={16} />
            </Link>
          </section>
        ),
      )}
    </>
  );
}
