"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export type CartContextType = {
  count: number;
  setCount: (n: number) => void;
  increment: (n?: number) => void;
  fetchCount: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const inflight = useRef<AbortController | null>(null);

  const fetchCount = async () => {
    try {
      inflight.current?.abort();
      const ctrl = new AbortController();
      inflight.current = ctrl;
      const res = await fetch("/api/cart", {
        cache: "no-store",
        signal: ctrl.signal,
      });
      if (!res.ok) return;
      const data = await res.json();
      const next = Array.isArray(data.items)
        ? data.items.reduce(
            (sum: number, it: any) => sum + (Number(it.quantity) || 0),
            0
          )
        : 0;
      setCount(next);
    } catch {
      /* ignore */
    } finally {
      inflight.current = null;
    }
  };

  const increment = (n = 1) => setCount((c) => c + n);

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <CartContext.Provider value={{ count, setCount, increment, fetchCount }}>
      {children}
    </CartContext.Provider>
  );
}
