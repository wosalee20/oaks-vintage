import prisma from "@/lib/prisma";
// Make sure the file exists at the specified path, or update the import path if necessary.
import CategoryForm from "../../../components/admin/CategoryForm";

export default async function CategoriesPage() {
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Categories</h1>

      {/* New category */}
      <CategoryForm />

      {/* Existing */}
      <div style={{ display: "grid", gap: 10 }}>
        {cats.map((c) => (
          <CategoryForm key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
