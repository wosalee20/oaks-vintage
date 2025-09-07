// Import Prisma client for database access
import prisma from "@/lib/prisma";
// Import ProductSearch component to display/search products
import ProductSearch from "@/components/ProductSearch";

// Products listing/search page
export default async function ProductsPage() {
  // Fetch all active products from the database
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  // Render the ProductSearch component with the fetched products
  return <ProductSearch initialProducts={products} />;
}
