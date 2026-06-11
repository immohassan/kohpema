import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import OrderRowActions from "@/components/admin/OrderRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="font-heading font-bold uppercase text-3xl tracking-tight mb-8">
        Orders
      </h1>
      <p className="text-sm text-neutral-500 mb-6">
        Orders are logged when a customer clicks “Order via WhatsApp”. Confirm
        the deal in chat, then update its status here.
      </p>
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-100 align-top hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold">#{o.number}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-1">
                    {o.items.map((i) => (
                      <li key={i.id} className="text-neutral-700">
                        {i.name} <span className="text-neutral-400">× {i.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatMoney(Number(o.total))}
                </td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                  {o.createdAt.toLocaleString()}
                </td>
                <td className="px-4 py-3" colSpan={2}>
                  <OrderRowActions id={o.id} status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-neutral-400">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
