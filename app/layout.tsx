import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "Bugadi";

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
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
