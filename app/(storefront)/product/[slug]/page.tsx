import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, formatInr } from "@/lib/catalog";
import { getProductBySlug, getRelated } from "@/lib/products";
import ImageSlot from "@/components/ui/ImageSlot";
import ProductCard from "@/components/shop/ProductCard";
import AddToCart from "@/components/shop/AddToCart";
import Reveal from "@/components/site/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: `${product.name} in oxidised German silver. ${product.motif} motif from ${product.region}. ${formatInr(product.priceInr)} incl. GST.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = await getRelated(product, 3);
  const soldOut = product.stock <= 0;

  // Product schema (doc 11). No invented reviews/ratings. Image omitted until
  // real product photography lands (06b) — TODO: add image URLs at launch.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.story,
    brand: { "@type": "Brand", name: "Bugadi" },
    category: category?.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.priceInr,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:pt-14">
        {/* Gallery */}
        <div>
          <ImageSlot
            label={product.name}
            src={product.imageUrl}
            alt={product.name}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-square w-full"
          />
          {product.images > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: Math.min(product.images, 4) }).map((_, i) => (
                <ImageSlot
                  key={i}
                  className="aspect-square w-full"
                  rounded="rounded-xl"
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Buy panel */}
        <div className="lg:pt-2">
          <p className="text-sm text-ink-muted">
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>{" "}
            /{" "}
            <Link href={`/category/${product.category}`} className="hover:text-ink">
              {category?.name}
            </Link>
          </p>
          <h1 className="mt-3 font-heading text-4xl text-ink lg:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            {product.motif} motif, {product.region}
          </p>
          <p className="mt-5 text-2xl text-ink">
            {formatInr(product.priceInr)}{" "}
            <span className="text-base text-ink-muted">incl. GST</span>
          </p>

          <AddToCart
            slug={product.slug}
            name={product.name}
            priceInr={product.priceInr}
            soldOut={soldOut}
            maxQty={product.stock}
          />

          <p className="mt-4 text-sm text-ink-muted">
            {soldOut
              ? "Currently out of stock."
              : product.stock <= 5
                ? `Only ${product.stock} left.`
                : "In stock, ready to ship."}
          </p>

          <p className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-ink-muted">
            Ships across India via Shiprocket, with cash on delivery available.{" "}
            <Link href="/returns" className="text-primary hover:underline">
              7-day returns
            </Link>{" "}
            on damaged or wrong items.
          </p>
        </div>
      </div>

      {/* Heritage Story — the killer feature */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:py-24">
        <Reveal trigger="view">
          <div className="rounded-3xl border border-border bg-surface px-8 py-12 lg:px-16 lg:py-16">
            <h2 className="font-heading text-2xl text-ink sm:text-3xl">The story</h2>
            <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-3 text-sm">
              <div>
                <dt className="text-ink-muted">Motif</dt>
                <dd className="text-ink">{product.motif}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Region</dt>
                <dd className="text-ink">{product.region}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Worn for</dt>
                <dd className="text-ink">{product.occasion}</dd>
              </div>
            </dl>
            <p className="mt-8 max-w-3xl font-heading text-xl leading-snug text-ink sm:text-2xl">
              {product.story}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Details */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8">
        <h2 className="font-heading text-2xl text-ink">Details</h2>
        <dl className="mt-6 max-w-2xl divide-y divide-border border-y border-border">
          {[
            { k: "Material", v: product.material },
            { k: "Size", v: product.size },
            { k: "Care", v: product.care },
          ].map((row) => (
            <div key={row.k} className="grid grid-cols-3 gap-4 py-4">
              <dt className="text-sm text-ink-muted">{row.k}</dt>
              <dd className="col-span-2 text-sm text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8">
          <h2 className="font-heading text-2xl text-ink sm:text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
