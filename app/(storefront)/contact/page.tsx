import type { Metadata } from "next";
import ContentPage from "@/components/site/ContentPage";
import ContactForm from "@/components/forms/ContactForm";
import { BRAND, INSTAGRAM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${BRAND} about an order, a piece, or anything else.`,
};

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact"
      intro="A question about an order or a piece? Message us on WhatsApp for the quickest reply, or send a note below."
    >
      <p className="text-sm">
        <strong className="text-ink">WhatsApp:</strong>{" "}
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{WHATSAPP_DISPLAY}</a>
        <br />
        <strong className="text-ink">Instagram:</strong>{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{INSTAGRAM_HANDLE}</a>
      </p>
      <ContactForm />
    </ContentPage>
  );
}
