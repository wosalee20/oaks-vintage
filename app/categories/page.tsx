import prisma from "@/lib/prisma";
import CategoriesClient from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 50,
  });

  return <CategoriesClient categories={categories} />;
}
