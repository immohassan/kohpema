"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function updateSettings(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; ok?: boolean }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const storeName = String(formData.get("storeName") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const announcement = String(formData.get("announcement") ?? "").trim();
  const currency =
    String(formData.get("currency") ?? "PKR").trim().toUpperCase() || "PKR";

  if (!storeName) return { error: "Store name is required" };
  if (whatsappNumber && !/^\+?[\d\s-]{7,20}$/.test(whatsappNumber)) {
    return { error: "WhatsApp number looks invalid (use e.g. +923001234567)" };
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { storeName, whatsappNumber, announcement, currency },
    create: { id: 1, storeName, whatsappNumber, announcement, currency },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
