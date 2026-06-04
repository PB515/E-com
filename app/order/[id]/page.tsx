import Placeholder from "@/components/Placeholder";

export const metadata = { title: "Order" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Placeholder
      title="Order confirmed"
      note={`Order ${id}. Server-rendered by id (non-enumerable). Phase 4.`}
    />
  );
}
