import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PayMock from "@/components/checkout/PayMock";

export const metadata: Metadata = { title: "Payment" };

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) redirect("/cart");
  return (
    <section className="px-5 py-16 sm:px-8 lg:py-24">
      <PayMock orderId={order} />
    </section>
  );
}
