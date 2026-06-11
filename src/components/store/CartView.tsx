"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import { formatMoney } from "@/lib/utils";

export default function CartView() {
  const { items, total, removeItem, setQuantity, clear } = useCart();
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setOrdering(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      clear();
      window.location.href = data.waLink;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setOrdering(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500 mb-6">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">
          Shop All Gear
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="py-5 flex gap-4 items-center"
          >
            <Link
              href={`/products/${item.slug}`}
              className="w-20 h-20 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="font-heading font-semibold uppercase tracking-wide hover:text-[#e8500a]"
              >
                {item.name}
              </Link>
              {item.variantTitle && (
                <div className="text-sm text-neutral-500">
                  {item.variantTitle}
                </div>
              )}
              <div className="text-sm font-semibold mt-1">
                {formatMoney(item.price)}
              </div>
            </div>
            <div className="inline-flex items-center border border-neutral-300">
              <button
                className="px-3 py-1 hover:bg-neutral-100"
                onClick={() =>
                  setQuantity(item.productId, item.variantId, item.quantity - 1)
                }
              >
                −
              </button>
              <span className="px-3 py-1 border-x border-neutral-300 min-w-10 text-center text-sm">
                {item.quantity}
              </span>
              <button
                className="px-3 py-1 hover:bg-neutral-100"
                onClick={() =>
                  setQuantity(item.productId, item.variantId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold">
              {formatMoney(item.price * item.quantity)}
            </div>
            <button
              className="text-neutral-400 hover:text-red-600 p-2"
              onClick={() => removeItem(item.productId, item.variantId)}
              aria-label="Remove"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4h8v2m-9 0l1 14h8l1-14" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="uppercase tracking-widest font-semibold">Total</span>
        <span className="text-2xl font-bold">{formatMoney(total)}</span>
      </div>
      <p className="text-sm text-neutral-500 mt-2 text-right">
        Checkout completes via WhatsApp — we&apos;ll confirm your order in chat.
      </p>

      {error && <div className="text-red-600 text-sm mt-4">{error}</div>}

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
        <Link href="/products" className="btn-outline">
          Continue Shopping
        </Link>
        <button
          onClick={checkout}
          disabled={ordering}
          className="btn-accent flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 14.4l-2.5-1.2c-.3-.1-.6-.1-.8.2l-1.1 1.3c-1.8-.9-3.3-2.4-4.2-4.2l1.3-1.1c.3-.2.3-.5.2-.8L9.2 6.1c-.1-.3-.5-.5-.8-.4-1.1.2-2.1 1-2.1 2.3 0 4.5 5.2 9.7 9.7 9.7 1.3 0 2.1-1 2.3-2.1.1-.4-.2-.7-.5-.9l-.3-.3zM12 1C5.9 1 1 5.9 1 12c0 2 .5 3.8 1.5 5.5L1 23l5.6-1.5C8.2 22.5 10 23 12 23c6.1 0 11-4.9 11-11S18.1 1 12 1zm0 20c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.3.9.9-3.3-.2-.4C3 15.5 2.5 13.8 2 12 2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9-10 9z" />
          </svg>
          {ordering ? "Opening WhatsApp..." : "Order via WhatsApp"}
        </button>
      </div>
    </div>
  );
}
