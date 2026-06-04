"use client";

/**
 * Client cart (Phase 3). State only — no DB, no payment (that is Phase 4).
 * Stores {slug, qty}; product details are resolved from lib/catalog so price
 * and stock stay single-sourced. Persists to localStorage. The real order +
 * GST + payment rail replaces the persistence layer in Phase 4.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct, type Product } from "@/lib/catalog";

interface CartEntry {
  slug: string;
  qty: number;
}

export interface CartLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

interface CartContextValue {
  count: number;
  subtotal: number;
  lines: CartLine[];
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  changeQty: (slug: string, delta: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bugadi-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [ready, setReady] = useState(false);

  // hydrate from localStorage after mount (avoids SSR mismatch)
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

  const add = useCallback((slug: string, qty = 1) => {
    const product = getProduct(slug);
    if (!product || product.stock <= 0) return;
    setEntries((prev) => {
      const existing = prev.find((e) => e.slug === slug);
      if (existing) {
        return prev.map((e) =>
          e.slug === slug
            ? { ...e, qty: Math.min(e.qty + qty, product.stock) }
            : e,
        );
      }
      return [...prev, { slug, qty: Math.min(qty, product.stock) }];
    });
  }, []);

  // functional delta update — correct even on rapid clicks before a re-render
  const changeQty = useCallback((slug: string, delta: number) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.slug !== slug) return e;
        const max = getProduct(slug)?.stock ?? 99;
        return { ...e, qty: Math.max(1, Math.min(e.qty + delta, max)) };
      }),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = entries
      .map((e) => {
        const product = getProduct(e.slug);
        return product
          ? { product, qty: e.qty, lineTotal: product.priceInr * e.qty }
          : null;
      })
      .filter((l): l is CartLine => l !== null);
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
