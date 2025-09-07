import { requireAdmin } from "@/lib/requireAdmin";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>New Product</h1>
      <ProductForm />
    </div>
  );
}
