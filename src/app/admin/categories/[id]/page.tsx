import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Category" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <nav className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
        <Link href="/admin/categories" className="hover:text-black">
          Categories
        </Link>{" "}
        / Edit
      </nav>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        {category.name}
      </h1>
      <CategoryForm category={category} />
    </div>
  );
}
