import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const SITE_NAME = "Bugadi";

// Heritage serif display (skill-approved, NOT Fraunces) + clean sans body.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Title template: the brand name appears ONCE (launch-gate check, doc 11).
  title: {
    default: "Bugadi — Traditional Indian Ornament, Styled to Wear Today",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Oxidised, antique-finish Indian jewellery — ear cuffs, earrings, bracelets, hasli, and pendants. Traditional ornament, styled to wear today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
