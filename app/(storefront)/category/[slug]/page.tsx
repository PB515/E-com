import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreCategory, getCategoryProducts } from "@/lib/categories";
import { getPublicTaxMode } from "@/lib/tax-settings";
import ProductCard from "@/components/shop/ProductCard";
import NewsletterBand from "@/components/site/NewsletterBand";
import Reveal from "@/components/site/Reveal";

// Categories are admin-managed (DB); product data is read live per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getStoreCategory(slug);
  if (!category) return { title: "Not found" };
  return {
    title: category.seoTitle || `Oxidised ${category.name}`,
    description: category.seoDescription || category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getStoreCategory(slug);
  if (!category) notFound();

  const products = await getCategoryProducts(slug);
  const showGst = (await getPublicTaxMode()) === "gst";

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-4 pt-12 sm:px-8 lg:pt-16">
        <p className="text-sm text-ink-muted">
          <a href="/shop" className="hover:text-ink">
            Shop
          </a>{" "}
          / {category.name}
        </p>
        <h1 className="mt-3 font-heading text-4xl text-ink lg:text-5xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">{category.description}</p>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.slug} trigger="view" delay={(i % 4) * 0.05}>
                <ProductCard product={p} showGst={showGst} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-surface px-8 py-16 text-center">
            <p className="font-heading text-2xl text-ink">No pieces here yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
              New pieces land in this category soon. Browse the full collection
              in the meantime.
            </p>
            <a
              href="/shop"
              className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              Shop all
            </a>
          </div>
        )}
      </section>

      <NewsletterBand />
    </>
  );
}
