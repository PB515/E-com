import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductEditor from "@/components/admin/ProductEditor";
import ProductGallery from "@/components/admin/ProductGallery";
import ProductDangerActions from "@/components/admin/ProductDangerActions";
import { scoreProduct } from "@/lib/completeness";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sb = await createClient();
  const { data: product } = await sb.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!product) notFound();

  const { data: images } = await sb
    .from("product_images")
    .select("id,url,is_primary")
    .eq("product_id", product.id)
    .order("is_primary", { ascending: false })
    .order("sort_order");

  const comp = scoreProduct(product, (images?.length ?? 0) > 0);
  const missing = comp.fields.filter((f) => !f.ok);

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">← Products</Link>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-ink">{product.name}</h1>
        <span className={`rounded-full px-4 py-1.5 text-sm font-medium ${comp.score >= 80 ? "bg-success/15 text-success" : comp.score >= 50 ? "bg-warning/15 text-warning" : "bg-error/15 text-error"}`}>
          {comp.score}% complete
        </span>
      </div>
      {missing.length > 0 ? (
        <p className="mt-2 text-sm text-ink-muted">
          Missing: {missing.map((m) => m.label).join(", ")}.
        </p>
      ) : (
        <p className="mt-2 text-sm text-success">This listing is complete.</p>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-lg text-ink">Images</h2>
        <div className="mt-4">
          <ProductGallery slug={product.slug} images={images ?? []} />
        </div>
      </div>

      <ProductEditor product={product} />
      <ProductDangerActions slug={product.slug} />
    </div>
  );
}
