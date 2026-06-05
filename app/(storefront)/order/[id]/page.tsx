import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { getOrderForConfirmation } from "@/lib/orders";
import { formatInr } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const inr = (v: unknown) => formatInr(Number(v));

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getOrderForConfirmation(id);
  if (!data) notFound();
  const { order, items } = data;

  const paid = order.status === "paid";
  const cod = order.status === "cod_confirmed";
  const noGst = order.tax_mode === "unregistered";

  return (
    <section className="mx-auto max-w-[760px] px-5 py-16 sm:px-8">
      <div className="flex items-center gap-3">
        <CheckCircle size={32} weight="fill" className="text-success" />
        <div>
          <h1 className="font-heading text-3xl text-ink">Order confirmed</h1>
          <p className="text-sm text-ink-muted">
            {order.order_number} ·{" "}
            {paid ? "Paid (test mode)" : cod ? "Cash on delivery" : order.status}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-surface p-6">
        <h2 className="font-heading text-xl text-ink">Your order</h2>
        <ul className="mt-4 divide-y divide-border">
          {items.map((it: any) => (
            <li key={it.id} className="flex justify-between gap-3 py-3 text-sm">
              <span className="text-ink-muted">
                {it.product_name}
                <span className="text-ink-muted/70"> &times; {it.qty}</span>
              </span>
              <span className="text-ink">{inr(it.line_total_inr)}</span>
            </li>
          ))}
        </ul>

        {noGst ? (
          <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between text-ink-muted">
              <dt>Place of supply</dt>
              <dd>{order.place_of_supply_state}</dd>
            </div>
          </dl>
        ) : (
          <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between text-ink-muted">
              <dt>Taxable value</dt>
              <dd>{inr(order.subtotal_inr - order.total_tax_amount)}</dd>
            </div>
            {order.is_intra_state ? (
              <>
                <div className="flex justify-between text-ink-muted">
                  <dt>CGST</dt>
                  <dd>{inr(order.cgst_amount)}</dd>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <dt>SGST</dt>
                  <dd>{inr(order.sgst_amount)}</dd>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-ink-muted">
                <dt>IGST</dt>
                <dd>{inr(order.igst_amount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <dt>Place of supply</dt>
              <dd>{order.place_of_supply_state}</dd>
            </div>
          </dl>
        )}
        <div className="mt-5 flex justify-between border-t border-border pt-5 text-ink">
          <span className="font-medium">Total{noGst ? "" : " (incl. GST)"}</span>
          <span className="font-medium">{inr(order.grand_total_inr)}</span>
        </div>
        {noGst ? (
          <p className="mt-4 text-xs text-ink-muted">
            GST is not charged on this order as the seller is not currently registered under GST.
          </p>
        ) : null}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-ink-muted">
        A confirmation email is on its way. We will share tracking once your
        pieces ship across India. This store is currently in test mode.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-block rounded-full border border-border px-6 py-3 text-sm text-ink transition-colors hover:bg-surface"
      >
        Continue shopping
      </Link>
    </section>
  );
}
