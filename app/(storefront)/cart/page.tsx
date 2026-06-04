import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your bag" };

// Phase 3: the live client cart. Empty / loading states live inside CartView.
export default function CartPage() {
  return <CartView />;
}
