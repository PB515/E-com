import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductEditor from "@/components/admin/ProductEditor";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
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

  const { data: img } = await sb
    .from("product_images")
    .select("url")
    .eq("product_id", product.id)
    .order("is_primary", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">← Products</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{product.name}</h1>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <h2 className="font-heading text-lg text-ink">Image</h2>
        <div className="mt-4">
          <ProductImageUpload slug={product.slug} currentUrl={img?.url} />
        </div>
      </div>

      <ProductEditor product={product} />
      <ProductDangerActions slug={product.slug} />
    </div>
  );
}
