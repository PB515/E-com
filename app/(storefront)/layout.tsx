import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { CartProvider } from "@/lib/cart/CartContext";
import { getNavCategories, getFooterCategories } from "@/lib/categories";

// Storefront chrome (header + footer) + the client cart provider. Admin lives
// outside this group and has its own layout, so neither the shop nav nor the
// cart appears on admin screens. Nav/footer categories are admin-managed (DB).
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navCategories, footerCategories] = await Promise.all([
    getNavCategories(),
    getFooterCategories(),
  ]);
  return (
    <CartProvider>
      <SiteHeader categories={navCategories.map((c) => ({ slug: c.slug, name: c.name }))} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={footerCategories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </CartProvider>
  );
}
