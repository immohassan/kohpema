import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const where: Prisma.ProductWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { sku: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: { select: { id: true } },
    },
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="font-heading font-bold uppercase text-3xl tracking-tight">
          Products
        </h1>
        <Link href="/admin/products/new" className="btn-accent !py-2.5">
          + Add Product
        </Link>
      </div>

      <form className="mb-6 flex gap-2 max-w-md">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or SKU..."
          className="input"
        />
        <button type="submit" className="btn-primary !py-2">
          Search
        </button>
      </form>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Variants</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 font-semibold hover:text-[#e8500a]"
                  >
                    <span className="w-10 h-10 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                      {p.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0].url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </span>
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {p.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3">{formatMoney(Number(p.price))}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.variants.length || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      p.published
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {p.published ? "Active" : "Draft"}
                  </span>
                  {p.featured && (
                    <span className="ml-1 inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-800">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs uppercase tracking-wider text-[#e8500a] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
