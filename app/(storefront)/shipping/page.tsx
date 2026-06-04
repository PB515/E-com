import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: "How Bugadi ships across India: pan-India delivery via Shiprocket, cash on delivery, and tracking.",
};

export default function ShippingPage() {
  return (
    <ContentPage
      title="Shipping & delivery"
      intro="We ship across India. International shipping is not available at launch."
    >
      <section>
        <h2>Where we ship</h2>
        <p>
          Pan-India delivery through Shiprocket and its courier network. Orders
          are dispatched from our location and tracked to your door.
        </p>
      </section>
      <section>
        <h2>Cash on delivery</h2>
        <p>
          Cash on delivery is available at checkout alongside online payment, so
          you can pay when the piece reaches you.
        </p>
      </section>
      <section>
        <h2>Timelines</h2>
        <p>
          Delivery times depend on your PIN code and the courier. Indicative
          windows and any charges are shown at checkout before you pay. Final
          rates are confirmed before launch.
        </p>
      </section>
      <section>
        <h2>Tracking</h2>
        <p>
          Once your order ships, a tracking link reaches you by email so you can
          follow it the whole way.
        </p>
      </section>
    </ContentPage>
  );
}
