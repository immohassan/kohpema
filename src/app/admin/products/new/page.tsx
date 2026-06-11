import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <nav className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
        <Link href="/admin/products" className="hover:text-black">
          Products
        </Link>{" "}
        / New
      </nav>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        New Product
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
