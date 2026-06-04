import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bugadi handles your data: what we collect, why, and your choices.",
};

// Aligned with the cookieless analytics decision (doc 11): no advertising
// cookies, no consent banner. Reviewed and finalised with the registered
// business details (name, GSTIN) before full launch (doc 02 / launch gate).
export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy policy"
      intro="A short, plain-language summary of how we handle your information. The final version is confirmed with our registered business details before full launch."
    >
      <section>
        <h2>What we collect</h2>
        <p>
          When you place an order or message us, we collect what is needed to
          fulfil it: your name, contact details, and shipping address. We do not
          ask for anything we do not need.
        </p>
      </section>
      <section>
        <h2>Analytics</h2>
        <p>
          We use privacy-friendly, cookieless analytics to understand which pages
          are useful. It does not track you across sites and does not set
          advertising cookies, so there is no consent banner to click through.
        </p>
      </section>
      <section>
        <h2>Payments</h2>
        <p>
          Payments are handled by our payment provider on their secure checkout.
          Your card details never reach our servers.
        </p>
      </section>
      <section>
        <h2>Where data lives</h2>
        <p>
          Your data is stored in the India region, in line with India&apos;s data
          protection rules.
        </p>
      </section>
      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us to access, correct, or delete your information at any
          time through our <a href="/contact">contact page</a>.
        </p>
      </section>
    </ContentPage>
  );
}
