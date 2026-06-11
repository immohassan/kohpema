import Link from "next/link";
import { formatMoney } from "@/lib/utils";

export type SpecCardData = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  specs: string[];
};

function SpecIcon({ text }: { text: string }) {
  const t = text.toUpperCase();
  const cls = "w-4 h-4 text-neutral-500";
  if (t.includes("LUMEN"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    );
  if (t.includes("HOUR") || t.includes("TIME"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  if (t.includes("IPX") || t.includes("IP6") || t.includes("WATER") || t.includes("DRY"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3c3.5 4.5 6 7.8 6 11a6 6 0 11-12 0c0-3.2 2.5-6.5 6-11z" />
      </svg>
    );
  if (/\d\s*(G|KG)\b/.test(t) || t.includes("WEIGHT"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8h12l2 13H4L6 8z" />
        <path d="M9 8a3 3 0 016 0" />
      </svg>
    );
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2l1.5 3.5L17 4l-.5 3.5L20 9l-2.5 2.5L20 14l-3.5.5L17 18l-3.5-1.5L12 20l-1.5-3.5L7 18l.5-3.5L4 14l2.5-2.5L4 9l3.5-.5L7 4l3.5 1.5L12 2z" opacity="0.5" />
    </svg>
  );
}

function splitSpec(spec: string): { value: string; label: string } {
  const parts = spec.split(" ");
  if (parts.length === 1) return { value: spec, label: "" };
  return { value: parts[0], label: parts.slice(1).join(" ") };
}

// Princeton-Tec-style card: name + price header, image, icon spec strip.
export default function SpecCard({ product }: { product: SpecCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white text-[#111] w-full"
    >
      <div className="flex justify-between items-start gap-2 px-4 pt-4">
        <h3 className="font-heading font-bold text-sm leading-snug">
          {product.name}
        </h3>
        <span className="text-sm font-semibold whitespace-nowrap">
          {formatMoney(product.price)}
        </span>
      </div>
      <div className="aspect-square px-6 py-4">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}
      </div>
      <div className="grid grid-cols-4 border-t border-neutral-200 divide-x divide-neutral-200">
        {product.specs.slice(0, 4).map((s) => {
          const { value, label } = splitSpec(s);
          return (
            <div key={s} className="flex flex-col items-center gap-0.5 py-2.5 px-1 text-center">
              <SpecIcon text={s} />
              <span className="text-[11px] font-bold leading-tight">{value}</span>
              <span className="text-[9px] text-neutral-500 leading-tight">{label || " "}</span>
            </div>
          );
        })}
        {Array.from({ length: Math.max(0, 4 - product.specs.length) }).map((_, i) => (
          <div key={i} className="py-2.5" />
        ))}
      </div>
    </Link>
  );
}
