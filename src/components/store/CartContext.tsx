"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantTitle: string | null;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  setQuantity: (
    productId: string,
    variantId: string | null,
    quantity: number
  ) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "kohpema_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted cart — start fresh
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const keyOf = (productId: string, variantId: string | null) =>
    `${productId}::${variantId ?? ""}`;

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const key = keyOf(item.productId, item.variantId);
      const existing = prev.find((i) => keyOf(i.productId, i.variantId) === key);
      if (existing) {
        return prev.map((i) =>
          keyOf(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem: CartContextType["removeItem"] = (productId, variantId) => {
    setItems((prev) =>
      prev.filter((i) => keyOf(i.productId, i.variantId) !== keyOf(productId, variantId))
    );
  };

  const setQuantity: CartContextType["setQuantity"] = (
    productId,
    variantId,
    quantity
  ) => {
    if (quantity < 1) return removeItem(productId, variantId);
    setItems((prev) =>
      prev.map((i) =>
        keyOf(i.productId, i.variantId) === keyOf(productId, variantId)
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, total, addItem, removeItem, setQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
