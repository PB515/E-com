import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Bugadi about an order, a piece, or anything else.",
};

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      intro="A question about an order or a piece? Send us a note and we will get back to you."
    >
      <ContactForm />
      <p className="text-sm">
        Direct email and WhatsApp channels are added before launch.
      </p>
    </ContentPage>
  );
}
