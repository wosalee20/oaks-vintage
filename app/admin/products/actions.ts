"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

const ImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url("Provide a valid image URL"),
  alt: z.string().optional().nullable(),
  order: z.number().int().min(0).default(0),
});

const ProductSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  priceKobo: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0),
  isActive: z.coerce.boolean(),
  categoryId: z.string().optional().nullable(),
  images: z.array(ImageSchema).default([]),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const parsed = ProductSchema.parse({
    title: data.title,
    slug: data.slug ? slugify(data.slug) : slugify(data.title),
    description: data.description || null,
    priceKobo: data.priceKobo,
    stock: data.stock,
    isActive: data.isActive === "on" || data.isActive === "true",
    categoryId: data.categoryId || null,
    images: JSON.parse(data.images || "[]"),
  });

  const created = await prisma.product.create({
    data: {
      title: parsed.title,
      slug: parsed.slug,
      description: parsed.description,
      priceKobo: parsed.priceKobo,
      stock: parsed.stock,
      isActive: parsed.isActive,
      categoryId: parsed.categoryId || undefined,
      images: {
        create: parsed.images.map((im) => ({
          url: im.url,
          alt: im.alt || null,
        })),
      },
    },
    select: { id: true, slug: true },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${created.id}`);
  return { ok: true, id: created.id, slug: created.slug };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const parsed = ProductSchema.parse({
    title: data.title,
    slug: data.slug ? slugify(data.slug) : slugify(data.title),
    description: data.description || null,
    priceKobo: data.priceKobo,
    stock: data.stock,
    isActive: data.isActive === "on" || data.isActive === "true",
    categoryId: data.categoryId || null,
    images: JSON.parse(data.images || "[]"),
  });

  // Update product core fields
  await prisma.product.update({
    where: { id },
    data: {
      title: parsed.title,
      slug: parsed.slug,
      description: parsed.description,
      priceKobo: parsed.priceKobo,
      stock: parsed.stock,
      isActive: parsed.isActive,
      categoryId: parsed.categoryId || undefined,
    },
  });

  // Sync images (delete removed, upsert others)
  const existing = await prisma.productImage.findMany({
    where: { productId: id },
  });
  const keepIds = new Set(
    parsed.images.map((i) => i.id).filter(Boolean) as string[]
  );
  const toDelete = existing.filter((e) => !keepIds.has(e.id));
  if (toDelete.length) {
    await prisma.productImage.deleteMany({
      where: { id: { in: toDelete.map((d) => d.id) } },
    });
  }

  for (const im of parsed.images) {
    if (im.id) {
      await prisma.productImage.update({
        where: { id: im.id },
        data: { url: im.url, alt: im.alt || null },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: id,
          url: im.url,
          alt: im.alt || null,
        },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/products`); // storefront list if needed
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { ok: true };
}
