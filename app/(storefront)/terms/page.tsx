import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for shopping with Bugadi: products, pricing, and orders.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & store policies"
      intro="The basics of shopping with Bugadi. Finalised with our registered business details before full launch."
    >
      <section>
        <h2>What we sell</h2>
        <p>
          Bugadi sells oxidised, antique-finish imitation jewellery in German
          silver. These are design pieces, not precious-metal or hallmarked fine
          jewellery. We ship within India only at launch.
        </p>
      </section>
      <section>
        <h2>Pricing and GST</h2>
        <p>
          Prices shown include GST. The GST applied to your order is calculated
          at checkout based on your shipping state, and is itemised on your
          invoice.
        </p>
      </section>
      <section>
        <h2>Orders</h2>
        <p>
          An order is confirmed once payment is captured, or once a cash-on-delivery
          order is placed. We will email you a confirmation. During this preview,
          the store runs in test mode and no real payments are taken.
        </p>
      </section>
      <section>
        <h2>Returns</h2>
        <p>
          Returns are accepted for damaged or wrong items within 7 days. See our{" "}
          <a href="/returns">returns page</a> for details.
        </p>
      </section>
    </ContentPage>
  );
}
