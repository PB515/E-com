"use client";

/**
 * Client cart. Stores a SNAPSHOT per line (slug, name, price, max stock) so the
 * client never needs the product database to render the bag. Persists to
 * localStorage. The snapshot is for DISPLAY only — at checkout the server
 * re-reads price/stock from Supabase and never trusts these client values.
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
}

interface CartEntry {
  slug: string;
  name: string;
  priceInr: number;
  qty: number;
  maxStock: number;
}

export interface CartLine extends CartEntry {
  lineTotal: number;
}

interface CartContextValue {
  count: number;
  subtotal: number;
  lines: CartLine[];
  ready: boolean;
  add: (item: CartItemInput, qty?: number) => void;
  changeQty: (slug: string, delta: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bugadi-cart-v1";

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
    setEntries((prev) => {
      const existing = prev.find((e) => e.slug === item.slug);
      if (existing) {
        return prev.map((e) =>
          e.slug === item.slug
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
        },
      ];
    });
  }, []);

  const changeQty = useCallback((slug: string, delta: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.slug === slug
          ? { ...e, qty: Math.max(1, Math.min(e.qty + delta, e.maxStock)) }
          : e,
      ),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = entries.map((e) => ({
      ...e,
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
