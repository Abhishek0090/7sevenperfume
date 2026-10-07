"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import type { Perfume } from "@/features/perfumes/types";
import type { CartItem } from "../types";

const STORAGE_KEY = "7seven-cart";

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; perfume: Perfume; quantity: number }
  | { type: "setQuantity"; perfumeId: string; quantity: number }
  | { type: "remove"; perfumeId: string }
  | { type: "clear"; dealerId?: string };

function clamp(quantity: number, stock: number) {
  return Math.max(0, Math.min(quantity, stock));
}

interface CartState {
  items: CartItem[];
  /** False until localStorage has been read on the client. */
  hydrated: boolean;
}

function reducer(state: CartState, action: Action): CartState {
  if (action.type === "hydrate") return { items: action.items, hydrated: true };
  return { ...state, items: itemsReducer(state.items, action) };
}

function itemsReducer(items: CartItem[], action: Exclude<Action, { type: "hydrate" }>): CartItem[] {
  switch (action.type) {
    case "add": {
      const { perfume } = action;
      const existing = items.find((i) => i.perfumeId === perfume.id);
      if (existing) {
        return items.map((i) =>
          i.perfumeId === perfume.id ? { ...i, quantity: clamp(i.quantity + action.quantity, i.stock) } : i,
        );
      }
      const quantity = clamp(action.quantity, perfume.stock);
      if (!quantity) return items;
      return [
        ...items,
        {
          perfumeId: perfume.id,
          slug: perfume.slug,
          name: perfume.name,
          image: perfume.images[0]?.src ?? "",
          price: perfume.price,
          sizeMl: perfume.sizeMl,
          stock: perfume.stock,
          dealer: perfume.dealer,
          quantity,
        },
      ];
    }
    case "setQuantity":
      return items
        .map((i) => (i.perfumeId === action.perfumeId ? { ...i, quantity: clamp(action.quantity, i.stock) } : i))
        .filter((i) => i.quantity > 0);
    case "remove":
      return items.filter((i) => i.perfumeId !== action.perfumeId);
    case "clear":
      return action.dealerId ? items.filter((i) => i.dealer.id !== action.dealerId) : [];
  }
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totalItems: number;
  subtotal: number;
  getQuantity: (perfumeId: string) => number;
  addItem: (perfume: Perfume, quantity?: number) => void;
  setQuantity: (perfumeId: string, quantity: number) => void;
  removeItem: (perfumeId: string) => void;
  clearCart: (dealerId?: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [{ items, hydrated }, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  // Load after mount so server and client render the same (empty) cart first.
  useEffect(() => {
    let saved: CartItem[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartItem[];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    dispatch({ type: "hydrate", items: saved });
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getQuantity: (perfumeId) => items.find((i) => i.perfumeId === perfumeId)?.quantity ?? 0,
      addItem: (perfume, quantity = 1) => dispatch({ type: "add", perfume, quantity }),
      setQuantity: (perfumeId, quantity) => dispatch({ type: "setQuantity", perfumeId, quantity }),
      removeItem: (perfumeId) => dispatch({ type: "remove", perfumeId }),
      clearCart: (dealerId) => dispatch({ type: "clear", dealerId }),
    }),
    [items, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within <CartProvider>");
  return context;
}
