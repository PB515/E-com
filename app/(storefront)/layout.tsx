import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { CartProvider } from "@/lib/cart/CartContext";

// Storefront chrome (header + footer) + the client cart provider. Admin lives
// outside this group and has its own layout, so neither the shop nav nor the
// cart appears on admin screens.
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </CartProvider>
  );
}
