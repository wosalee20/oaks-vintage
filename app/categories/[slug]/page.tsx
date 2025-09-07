import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

import CategoryClient from "@/components/CategoryClient";

/* ---------- page component ---------- */
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const sp = await searchParams;
  const pageSize = 20;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);

  // Find category by slug OR id (support both)
  const category = await prisma.category.findFirst({
    where: { OR: [{ slug: resolvedParams.slug }, { id: resolvedParams.slug }] },
  });

  if (!category) return notFound();

  // Products in this category (active only)
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, categoryId: category.id },
      include: { images: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({
      where: { isActive: true, categoryId: category.id },
    }),
  ]);

  const hasMore = page * pageSize < total;

  return (
    <CategoryClient
      category={category}
      products={products}
      hasMore={hasMore}
      page={page}
      slug={resolvedParams.slug}
    />
  );
}
