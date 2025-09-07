import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) return notFound();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
