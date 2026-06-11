import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      },
    },
  });

  if (!category || !category.published) notFound();

  return (
    <div>
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h1 className="font-heading font-bold uppercase text-4xl lg:text-5xl tracking-tight">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 text-neutral-300 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {category.products.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No products in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {category.products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  slug: p.slug,
                  name: p.name,
                  price: Number(p.price),
                  comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
                  image: p.images[0]?.url ?? null,
                  specs: (p.specs as string[]) ?? [],
                  categoryName: category.name,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
