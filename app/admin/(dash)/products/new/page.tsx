import Link from "next/link";
import NewProductForm from "@/components/admin/NewProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">← Products</Link>
      <h1 className="mt-3 font-heading text-3xl text-ink">New product</h1>
      <NewProductForm />
    </div>
  );
}
