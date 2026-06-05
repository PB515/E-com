import { BRAND, WHATSAPP_NUMBER } from "@/lib/site";

// Phase-1 checkout: orders are confirmed over WhatsApp (no online payment yet).
// These build the wa.me deep link with a pre-filled, human-readable message.

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export interface WaLine {
  name: string;
  variantLabel?: string;
  qty: number;
  lineTotal: number;
}

// Whole-cart order message.
export function cartOrderMessage(lines: WaLine[], total: number): string {
  const items = lines
    .map((l) => {
      const label = l.variantLabel && l.variantLabel !== "Standard" ? ` (${l.variantLabel})` : "";
      return `• ${l.name}${label} × ${l.qty} — ${inr(l.lineTotal)}`;
    })
    .join("\n");
  return (
    `Hi ${BRAND}, I'd like to order:\n\n` +
    `${items}\n\n` +
    `Total: ${inr(total)}\n\n` +
    `Name:\n` +
    `Address:\n` +
    `Payment preference: UPI / COD`
  );
}

// Single-product message from a product page.
export function productOrderMessage(name: string, variantLabel: string | undefined, qty: number, price: number): string {
  const label = variantLabel && variantLabel !== "Standard" ? ` (${variantLabel})` : "";
  return (
    `Hi ${BRAND}, I'd like to order:\n\n` +
    `• ${name}${label} × ${qty} — ${inr(price * qty)}\n\n` +
    `Name:\n` +
    `Address:\n` +
    `Payment preference: UPI / COD`
  );
}

export function cartLink(lines: WaLine[], total: number): string {
  return waLink(cartOrderMessage(lines, total));
}
export function productLink(name: string, variantLabel: string | undefined, qty: number, price: number): string {
  return waLink(productOrderMessage(name, variantLabel, qty, price));
}
