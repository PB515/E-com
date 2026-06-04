import Placeholder from "@/components/Placeholder";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Placeholder
      title={`Product: ${slug}`}
      note="PDP with the Wearable Heritage story + gallery + Add to Cart — Phase 2/3."
    />
  );
}
