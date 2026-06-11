import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        options: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <nav className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
        <Link href="/admin/products" className="hover:text-black">
          Products
        </Link>{" "}
        / Edit
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-heading font-bold uppercase text-3xl tracking-tight">
          {product.name}
        </h1>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          className="text-xs uppercase tracking-wider text-[#e8500a] hover:underline"
        >
          View in store →
        </Link>
      </div>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          sku: product.sku,
          stock: product.stock,
          published: product.published,
          featured: product.featured,
          categoryId: product.categoryId,
          specs: (product.specs as string[]) ?? [],
          videoUrl: product.videoUrl,
          images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
          options: product.options.map((o) => ({ name: o.name, values: o.values })),
          variants: product.variants.map((v) => ({
            title: v.title,
            options: (v.options as Record<string, string>) ?? {},
            price: v.price ? Number(v.price) : null,
            sku: v.sku,
            stock: v.stock,
          })),
        }}
      />
    </div>
  );
}
