import Link from "next/link";
import { type Product, formatInr } from "@/lib/catalog";
import ImageSlot from "@/components/ui/ImageSlot";

// One product card, reused across category grid, related, and the home rail
// (skill: one component, no three-inconsistent-cards).
export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative">
        <ImageSlot
          label={product.name}
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full transition-colors group-hover:border-ink-muted/40"
        />
        {soldOut ? (
          <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-3 py-1 text-xs text-ink-muted backdrop-blur">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="font-heading text-lg text-ink">{product.name}</p>
        <p className="text-sm text-ink-muted">
          {product.motif} motif, {product.region}
        </p>
        <p className="mt-1 text-sm text-ink">
          {formatInr(product.priceInr)}{" "}
          <span className="text-ink-muted">incl. GST</span>
        </p>
      </div>
    </Link>
  );
}
