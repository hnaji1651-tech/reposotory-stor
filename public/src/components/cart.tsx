"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  color?: string;
  size?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  lastAddedAt: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string, color?: string, size?: string) => void;
  updateQty: (slug: string, color: string | undefined, size: string | undefined, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "atlas-cart-v1";

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.slug === "string" && typeof i.qty === "number");
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.slug === item.slug && p.color === item.color && p.size === item.size
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setLastAddedAt(Date.now());
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, color?: string, size?: string) => {
    setItems((prev) => prev.filter((p) => !(p.slug === slug && p.color === color && p.size === size)));
  }, []);

  const updateQty = useCallback(
    (slug: string, color: string | undefined, size: string | undefined, qty: number) => {
      if (qty <= 0) {
        removeItem(slug, color, size);
        return;
      }
      setItems((prev) =>
        prev.map((p) =>
          p.slug === slug && p.color === color && p.size === size
            ? { ...p, qty: Math.min(99, qty) }
            : p
        )
      );
    },
    [removeItem]
  );

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotalCents } = useMemo(() => {
    return {
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotalCents: items.reduce((s, i) => s + i.qty * i.priceCents, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotalCents,
      isOpen,
      lastAddedAt,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQty,
      clear,
    }),
    [items, count, subtotalCents, isOpen, lastAddedAt, openCart, closeCart, addItem, removeItem, updateQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
