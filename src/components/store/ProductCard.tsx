import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  comparePrice: number | null;
  image: string | null;
  specs: string[];
  categoryName?: string | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border border-neutral-200 bg-white hover:border-black transition-colors"
    >
      <div className="aspect-square overflow-hidden bg-neutral-100 relative">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm uppercase tracking-widest">
            No image
          </div>
        )}
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="absolute top-3 left-3 bg-[#e8500a] text-white text-xs font-bold uppercase tracking-wider px-2 py-1">
            Sale
          </span>
        )}
        <span className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-center text-xs uppercase tracking-widest py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Quick View
        </span>
      </div>
      <div className="p-4">
        {product.categoryName && (
          <div className="text-[11px] uppercase tracking-widest text-neutral-500 mb-1">
            {product.categoryName}
          </div>
        )}
        <h3 className="font-heading font-semibold uppercase tracking-wide leading-snug">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold">{formatMoney(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-neutral-400 line-through">
              {formatMoney(product.comparePrice)}
            </span>
          )}
        </div>
        {product.specs.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-neutral-100 pt-3">
            {product.specs.slice(0, 3).map((s) => (
              <li
                key={s}
                className="text-[11px] uppercase tracking-wider text-neutral-600 flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-[#e8500a] inline-block shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
