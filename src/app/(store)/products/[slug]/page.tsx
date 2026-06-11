import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductPurchase from "@/components/store/ProductPurchase";
import ProductGallery from "@/components/store/ProductGallery";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      options: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: { select: { name: true, slug: true } },
    },
  });

  if (!product || !product.published) notFound();

  const related = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      categoryId: product.categoryId ?? undefined,
    },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    take: 4,
  });

  const specs = (product.specs as string[]) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="text-xs uppercase tracking-widest text-neutral-500 mb-8 flex gap-2">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-black"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <ProductGallery
          images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
          name={product.name}
        />

        <div>
          {product.category && (
            <div className="text-xs uppercase tracking-[0.25em] text-[#e8500a] font-semibold mb-2">
              {product.category.name}
            </div>
          )}
          <h1 className="font-heading font-bold uppercase text-4xl tracking-tight mb-2">
            {product.name}
          </h1>
          {product.sku && (
            <div className="text-xs text-neutral-400 mb-4">
              SKU: {product.sku}
            </div>
          )}

          {specs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {specs.map((s) => (
                <span
                  key={s}
                  className="border border-neutral-300 px-3 py-1 text-[11px] uppercase tracking-wider font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <ProductPurchase
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              comparePrice: product.comparePrice
                ? Number(product.comparePrice)
                : null,
              stock: product.stock,
              image: product.images[0]?.url ?? null,
            }}
            options={product.options.map((o) => ({
              name: o.name,
              values: o.values,
            }))}
            variants={product.variants.map((v) => ({
              id: v.id,
              title: v.title,
              options: (v.options as Record<string, string>) ?? {},
              price: v.price ? Number(v.price) : null,
              stock: v.stock,
            }))}
          />

          {product.description && (
            <div className="mt-10 border-t border-neutral-200 pt-6">
              <h2 className="font-heading font-semibold uppercase tracking-widest text-sm mb-3">
                Description
              </h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading font-bold uppercase text-3xl tracking-tight text-center mb-10">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  slug: p.slug,
                  name: p.name,
                  price: Number(p.price),
                  comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
                  image: p.images[0]?.url ?? null,
                  specs: (p.specs as string[]) ?? [],
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
