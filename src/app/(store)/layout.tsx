import { prisma } from "@/lib/prisma";
import { CartProvider } from "@/components/store/CartContext";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <CartProvider>
      <Header
        categories={categories}
        announcement={settings?.announcement ?? ""}
      />
      <main className="flex-1 bg-[#f0eae3]">{children}</main>
      <Footer categories={categories} />
    </CartProvider>
  );
}
