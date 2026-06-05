"use client";

/**
 * Client cart. Stores a SNAPSHOT per line (slug, name, price, variant, max
 * stock) so the client never needs the product database to render the bag.
 * Persists to localStorage. The snapshot is for DISPLAY only — at checkout the
 * server re-reads price/stock from Supabase and never trusts these client values.
 *
 * Lines are keyed by slug + variant, so the same product in two variants is two
 * lines. Legacy single-variant products use the variant's id transparently.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItemInput {
  slug: string;
  name: string;
  priceInr: number;
  stock: number;
  variantId?: string;
  variantLabel?: string;
}

interface CartEntry {
  slug: string;
  name: string;
  priceInr: number;
  qty: number;
  maxStock: number;
  variantId: string; // "" when the product has no variant model (legacy)
  variantLabel: string; // "" or "Standard" => not shown
}

export interface CartLine extends CartEntry {
  lineId: string; // slug + variant — the stable key for qty/remove
  lineTotal: number;
}

interface CartContextValue {
  count: number;
  subtotal: number;
  lines: CartLine[];
  ready: boolean;
  add: (item: CartItemInput, qty?: number) => void;
  changeQty: (lineId: string, delta: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
// v2: lines now carry a variant. Old v1 carts are dropped (a cart is ephemeral).
const STORAGE_KEY = "bugadi-cart-v2";

const lineKey = (slug: string, variantId: string) => `${slug}::${variantId}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as CartEntry[]);
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage may be unavailable; cart still works in-session
    }
  }, [entries, ready]);

  const add = useCallback((item: CartItemInput, qty = 1) => {
    if (item.stock <= 0) return;
    const variantId = item.variantId ?? "";
    setEntries((prev) => {
      const existing = prev.find(
        (e) => e.slug === item.slug && e.variantId === variantId,
      );
      if (existing) {
        return prev.map((e) =>
          e.slug === item.slug && e.variantId === variantId
            ? { ...e, qty: Math.min(e.qty + qty, item.stock), maxStock: item.stock, priceInr: item.priceInr }
            : e,
        );
      }
      return [
        ...prev,
        {
          slug: item.slug,
          name: item.name,
          priceInr: item.priceInr,
          qty: Math.min(qty, item.stock),
          maxStock: item.stock,
          variantId,
          variantLabel: item.variantLabel ?? "",
        },
      ];
    });
  }, []);

  const changeQty = useCallback((lineId: string, delta: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        lineKey(e.slug, e.variantId) === lineId
          ? { ...e, qty: Math.max(1, Math.min(e.qty + delta, e.maxStock)) }
          : e,
      ),
    );
  }, []);

  const remove = useCallback((lineId: string) => {
    setEntries((prev) => prev.filter((e) => lineKey(e.slug, e.variantId) !== lineId));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = entries.map((e) => ({
      ...e,
      lineId: lineKey(e.slug, e.variantId),
      lineTotal: e.priceInr * e.qty,
    }));
    return {
      lines,
      count: entries.reduce((sum, e) => sum + e.qty, 0),
      subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      ready,
      add,
      changeQty,
      remove,
      clear,
    };
  }, [entries, ready, add, changeQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
