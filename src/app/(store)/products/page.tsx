import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Shop All" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;

  const where: Prisma.ProductWhereInput = { published: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = { slug: category };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true } },
      },
    }),
    prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const qs = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { q, category, sort, ...params };
    Object.entries(merged).forEach(([k, v]) => v && sp.set(k, v));
    const s = sp.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading font-bold uppercase text-4xl tracking-tight mb-2">
        {q ? `Search: "${q}"` : "Shop All Gear"}
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        {products.length} product{products.length === 1 ? "" : "s"}
      </p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0">
          <h3 className="font-heading font-semibold uppercase tracking-widest text-sm mb-4 border-b border-neutral-200 pb-2">
            Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={`/products${qs({ category: undefined })}`}
                className={!category ? "text-[#e8500a] font-semibold" : "hover:text-[#e8500a]"}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products${qs({ category: c.slug })}`}
                  className={
                    category === c.slug
                      ? "text-[#e8500a] font-semibold"
                      : "hover:text-[#e8500a]"
                  }
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="font-heading font-semibold uppercase tracking-widest text-sm mt-8 mb-4 border-b border-neutral-200 pb-2">
            Sort By
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Newest", value: undefined },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" },
              { label: "Name A–Z", value: "name" },
            ].map((o) => (
              <li key={o.label}>
                <Link
                  href={`/products${qs({ sort: o.value })}`}
                  className={
                    sort === o.value || (!sort && !o.value)
                      ? "text-[#e8500a] font-semibold"
                      : "hover:text-[#e8500a]"
                  }
                >
                  {o.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: Number(p.price),
                    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
                    image: p.images[0]?.url ?? null,
                    specs: (p.specs as string[]) ?? [],
                    categoryName: p.category?.name,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
