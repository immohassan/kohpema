"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export type ProductPayload = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  stock: number;
  published: boolean;
  featured: boolean;
  categoryId: string | null;
  specs: string[];
  videoUrl: string | null;
  images: { url: string; alt?: string | null }[];
  options: { name: string; values: string[] }[];
  variants: {
    title: string;
    options: Record<string, string>;
    price: number | null;
    sku: string | null;
    stock: number;
  }[];
};

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base) || "product";
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

function validate(payload: ProductPayload): string | null {
  if (!payload.name?.trim()) return "Name is required";
  if (isNaN(payload.price) || payload.price < 0) return "Valid price required";
  return null;
}

export async function createProduct(payload: ProductPayload) {
  await assertAdmin();
  const error = validate(payload);
  if (error) return { error };

  const slug = await uniqueSlug(payload.slug?.trim() || payload.name);

  const product = await prisma.product.create({
    data: {
      name: payload.name.trim(),
      slug,
      description: payload.description ?? "",
      price: payload.price,
      comparePrice: payload.comparePrice,
      sku: payload.sku,
      stock: payload.stock,
      published: payload.published,
      featured: payload.featured,
      categoryId: payload.categoryId,
      specs: payload.specs,
      videoUrl: payload.videoUrl,
      images: {
        create: payload.images.map((img, i) => ({
          url: img.url,
          alt: img.alt ?? payload.name,
          sortOrder: i,
        })),
      },
      options: {
        create: payload.options.map((o, i) => ({
          name: o.name,
          values: o.values,
          sortOrder: i,
        })),
      },
      variants: {
        create: payload.variants.map((v) => ({
          title: v.title,
          options: v.options,
          price: v.price,
          sku: v.sku,
          stock: v.stock,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}?saved=1`);
}

export async function updateProduct(id: string, payload: ProductPayload) {
  await assertAdmin();
  const error = validate(payload);
  if (error) return { error };

  const slug = await uniqueSlug(payload.slug?.trim() || payload.name, id);

  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productOption.deleteMany({ where: { productId: id } }),
    prisma.variant.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name: payload.name.trim(),
        slug,
        description: payload.description ?? "",
        price: payload.price,
        comparePrice: payload.comparePrice,
        sku: payload.sku,
        stock: payload.stock,
        published: payload.published,
        featured: payload.featured,
        categoryId: payload.categoryId,
        specs: payload.specs,
        videoUrl: payload.videoUrl,
        images: {
          create: payload.images.map((img, i) => ({
            url: img.url,
            alt: img.alt ?? payload.name,
            sortOrder: i,
          })),
        },
        options: {
          create: payload.options.map((o, i) => ({
            name: o.name,
            values: o.values,
            sortOrder: i,
          })),
        },
        variants: {
          create: payload.variants.map((v) => ({
            title: v.title,
            options: v.options,
            price: v.price,
            sku: v.sku,
            stock: v.stock,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
