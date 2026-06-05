import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductEditor from "@/components/admin/ProductEditor";
import ProductGallery from "@/components/admin/ProductGallery";
import ProductDangerActions from "@/components/admin/ProductDangerActions";

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

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">← Products</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{product.name}</h1>

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
