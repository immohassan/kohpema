import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";

export const metadata = { title: "New Category" };

export default function NewCategoryPage() {
  return (
    <div>
      <nav className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
        <Link href="/admin/categories" className="hover:text-black">
          Categories
        </Link>{" "}
        / New
      </nav>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        New Category
      </h1>
      <CategoryForm />
    </div>
  );
}
