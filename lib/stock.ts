import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

type SB = ReturnType<typeof createAdminClient>;

export interface StockMovementInput {
  variantId: string;
  productId: string;
  delta: number; // negative = out (sale/damage), positive = in (restock/return)
  reason: "sale" | "manual" | "damage" | "return" | "restock" | "adjustment";
  source?: string;
  orderId?: string;
  note?: string;
  actorEmail?: string;
}

// Apply a stock change to a variant, log a movement, refresh the product mirror.
// This is the ONLY way stock changes — one pool, full history, no overselling.
export async function applyStockMovement(sb: SB, m: StockMovementInput): Promise<void> {
  const { data: v } = await sb
    .from("product_variants")
    .select("stock")
    .eq("id", m.variantId)
    .maybeSingle();
  if (!v) return;
  const next = Math.max(0, Number(v.stock) + m.delta);
  await sb.from("product_variants").update({ stock: next }).eq("id", m.variantId);
  await sb.from("stock_movements").insert({
    variant_id: m.variantId,
    product_id: m.productId,
    delta: m.delta,
    reason: m.reason,
    source: m.source ?? null,
    order_id: m.orderId ?? null,
    note: m.note ?? null,
    actor_email: m.actorEmail ?? null,
  });
  await recomputeProductStock(sb, m.productId);
}

// products.stock = sum of active variant stock (the storefront "total available").
export async function recomputeProductStock(sb: SB, productId: string): Promise<void> {
  const { data: vs } = await sb
    .from("product_variants")
    .select("stock,is_active")
    .eq("product_id", productId);
  const total = (vs ?? [])
    .filter((x: { is_active: boolean }) => x.is_active)
    .reduce((s: number, x: { stock: number }) => s + Number(x.stock), 0);
  await sb.from("products").update({ stock: total }).eq("id", productId);
}

// First active variant for a product. Website orders use this until the
// storefront variant picker ships.
export async function defaultVariant(
  sb: SB,
  productId: string,
): Promise<{ id: string; label: string; price_inr: number | null } | null> {
  const { data } = await sb
    .from("product_variants")
    .select("id,label,price_inr")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(1)
    .maybeSingle();
  return data ?? null;
}
