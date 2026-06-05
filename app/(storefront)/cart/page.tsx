import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { getPublicTaxMode } from "@/lib/tax-settings";

export const metadata: Metadata = { title: "Your bag" };
export const dynamic = "force-dynamic";

// Phase 3: the live client cart. Empty / loading states live inside CartView.
export default async function CartPage() {
  const showGst = (await getPublicTaxMode()) === "gst";
  return <CartView showGst={showGst} />;
}
