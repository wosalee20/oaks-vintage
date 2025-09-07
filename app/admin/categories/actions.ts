"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

const CategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "");
  const slugRaw = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");

  const parsed = CategorySchema.parse({
    name,
    slug: slugRaw ? slugRaw : name,
    description,
  });
  const created = await prisma.category.create({
    data: {
      name: parsed.name,
      slug: slugify(parsed.slug),
      description: parsed.description || null,
    },
  });

  revalidatePath("/admin/categories");
  return { ok: true, id: created.id };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "");
  const slugRaw = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");
  const parsed = CategorySchema.parse({
    name,
    slug: slugRaw ? slugRaw : name,
    description,
  });

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.name,
      slug: slugify(parsed.slug),
      description: parsed.description || null,
    },
  });

  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  // Optional: prevent delete if products exist (you can change to cascade)
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0)
    throw new Error("Category has products. Move or remove them first.");
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { ok: true };
}
