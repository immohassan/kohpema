"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartContext";
import { formatMoney } from "@/lib/utils";

type VariantData = {
  id: string;
  title: string;
  options: Record<string, string>;
  price: number | null;
  stock: number;
};

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    image: string | null;
  };
  options: { name: string; values: string[] }[];
  variants: VariantData[];
};

export default function ProductPurchase({ product, options, variants }: Props) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = useMemo(() => {
    if (variants.length === 0) return null;
    return (
      variants.find((v) =>
        Object.entries(selected).every(([k, val]) => v.options[k] === val)
      ) ?? null
    );
  }, [variants, selected]);

  const price = variant?.price ?? product.price;
  const stock = variant ? variant.stock : product.stock;
  const unavailable = (variants.length > 0 && !variant) || stock <= 0;

  function cartItem() {
    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      variantTitle: variant?.title ?? null,
      price,
      image: product.image,
    };
  }

  function handleAdd() {
    if (unavailable) return;
    addItem(cartItem(), quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function handleOrderNow() {
    if (unavailable) return;
    setOrdering(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              variantId: variant?.id ?? null,
              quantity,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      window.open(data.waLink, "_blank");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold">{formatMoney(price)}</span>
        {product.comparePrice && product.comparePrice > price && (
          <span className="text-lg text-neutral-400 line-through">
            {formatMoney(product.comparePrice)}
          </span>
        )}
      </div>

      {options.map((opt) => (
        <div key={opt.name} className="mb-5">
          <div className="label">{opt.name}</div>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const active = selected[opt.name] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    setSelected((s) => ({ ...s, [opt.name]: val }))
                  }
                  className={`px-4 py-2 text-sm border transition-colors ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:border-black"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <div className="label">Quantity</div>
        <div className="inline-flex items-center border border-neutral-300">
          <button
            type="button"
            className="px-4 py-2 hover:bg-neutral-100"
            onClick={() => setQuantity((n) => Math.max(1, n - 1))}
          >
            −
          </button>
          <span className="px-5 py-2 border-x border-neutral-300 min-w-12 text-center">
            {quantity}
          </span>
          <button
            type="button"
            className="px-4 py-2 hover:bg-neutral-100"
            onClick={() => setQuantity((n) => n + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="text-sm mb-4">
        {unavailable ? (
          <span className="text-red-600 font-semibold uppercase tracking-wider">
            Out of stock
          </span>
        ) : stock <= 5 ? (
          <span className="text-[#e8500a] font-semibold uppercase tracking-wider">
            Only {stock} left
          </span>
        ) : (
          <span className="text-green-700 font-semibold uppercase tracking-wider">
            In stock
          </span>
        )}
      </div>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={unavailable}
          className="btn-outline flex-1"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={handleOrderNow}
          disabled={unavailable || ordering}
          className="btn-accent flex-1 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 14.4l-2.5-1.2c-.3-.1-.6-.1-.8.2l-1.1 1.3c-1.8-.9-3.3-2.4-4.2-4.2l1.3-1.1c.3-.2.3-.5.2-.8L9.2 6.1c-.1-.3-.5-.5-.8-.4-1.1.2-2.1 1-2.1 2.3 0 4.5 5.2 9.7 9.7 9.7 1.3 0 2.1-1 2.3-2.1.1-.4-.2-.7-.5-.9l-.3-.3zM12 1C5.9 1 1 5.9 1 12c0 2 .5 3.8 1.5 5.5L1 23l5.6-1.5C8.2 22.5 10 23 12 23c6.1 0 11-4.9 11-11S18.1 1 12 1zm0 20c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.3.9.9-3.3-.2-.4C3 15.5 2.5 13.8 2 12 2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 9-10 9z" />
          </svg>
          {ordering ? "Opening..." : "Order on WhatsApp"}
        </button>
      </div>
    </div>
  );
}
