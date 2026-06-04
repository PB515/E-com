import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductEditor from "@/components/admin/ProductEditor";

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

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">
        ← Products
      </Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">{product.name}</h1>
      <ProductEditor product={product} />
    </div>
  );
}
