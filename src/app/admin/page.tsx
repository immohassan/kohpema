import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount, pendingCount, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true },
      }),
    ]);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Pending Orders", value: pendingCount, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-neutral-200 p-6 hover:border-black transition-colors"
          >
            <div className="text-3xl font-bold font-heading">{s.value}</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500 mt-1">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-heading font-semibold uppercase tracking-widest text-sm">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-[#e8500a] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-neutral-400 text-sm">
            No orders yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-100">
                  <td className="px-6 py-3 font-semibold">#{o.number}</td>
                  <td className="px-6 py-3">
                    {o.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-6 py-3">{formatMoney(Number(o.total))}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-3 text-neutral-500">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    FULFILLED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${colors[status] ?? "bg-neutral-100"}`}
    >
      {status}
    </span>
  );
}
