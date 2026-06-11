"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base) || "category";
  let n = 1;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function createCategory(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await assertAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };

  await prisma.category.create({
    data: {
      name,
      slug: await uniqueSlug(String(formData.get("slug") || name)),
      description: String(formData.get("description") ?? "") || null,
      image: String(formData.get("image") ?? "") || null,
      published: formData.get("published") === "on",
      sortOrder: parseInt(String(formData.get("sortOrder") ?? "0")) || 0,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await assertAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: await uniqueSlug(String(formData.get("slug") || name), id),
      description: String(formData.get("description") ?? "") || null,
      image: String(formData.get("image") ?? "") || null,
      published: formData.get("published") === "on",
      sortOrder: parseInt(String(formData.get("sortOrder") ?? "0")) || 0,
    },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
