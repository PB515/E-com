import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";
import ReturnForm from "@/components/forms/ReturnForm";

export const metadata: Metadata = {
  title: "Returns",
  description: "Bugadi's 7-day return policy for damaged or wrong items, and how to request a return.",
};

export default function ReturnsPage() {
  return (
    <ContentPage
      title="Returns"
      intro="We accept returns within 7 days for items that arrive damaged or are not what you ordered."
    >
      <section>
        <h2>What is covered</h2>
        <p>
          Returns are for items that arrive <strong>damaged</strong> or are the{" "}
          <strong>wrong item</strong>. Please tell us within 7 days of delivery.
          Change of mind and normal wear are not eligible, which keeps prices
          honest for everyone.
        </p>
      </section>
      <section>
        <h2>How a refund works</h2>
        <p>
          For a valid damaged or wrong item, we issue a credit note that reverses
          the GST charged, within the same financial year. We will confirm the
          resolution once we have reviewed your request.
        </p>
      </section>
      <section>
        <h2>Request a return</h2>
        <ReturnForm />
      </section>
    </ContentPage>
  );
}
