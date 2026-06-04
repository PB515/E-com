import Placeholder from "@/components/Placeholder";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Placeholder
      title={`Category: ${slug}`}
      note="One of: ear-cuffs · earrings · bracelets · hasli · pendants. Listing wires up in Phase 3."
    />
  );
}
