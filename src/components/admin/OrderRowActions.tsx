"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus, deleteOrder } from "@/lib/actions/orders";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED"];

export default function OrderRowActions({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <select
        className="input !w-36"
        value={status}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            updateOrderStatus(id, e.target.value as OrderStatus)
          )
        }
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this order?")) return;
          startTransition(() => deleteOrder(id));
        }}
        className="text-xs uppercase tracking-wider text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
