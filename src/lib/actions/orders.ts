"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await assertAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function deleteOrder(id: string) {
  await assertAdmin();
  await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
