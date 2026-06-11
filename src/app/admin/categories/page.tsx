import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="font-heading font-bold uppercase text-3xl tracking-tight">
          Categories
        </h1>
        <Link href="/admin/categories/new" className="btn-accent !py-2.5">
          + Add Category
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm min-w-150">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="flex items-center gap-3 font-semibold hover:text-[#e8500a]"
                  >
                    <span className="w-10 h-10 bg-neutral-100 border border-neutral-200 shrink-0 overflow-hidden">
                      {c.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </span>
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-500">{c.slug}</td>
                <td className="px-4 py-3">{c._count.products}</td>
                <td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      c.published
                        ? "bg-green-100 text-green-800"
                        : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {c.published ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="text-xs uppercase tracking-wider text-[#e8500a] hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <DeleteCategoryButton id={c.id} name={c.name} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
