// /app/search/page.tsx
// Server component for the /search route. It reads the search query from the URL and fetches matching products from the database.

// Import Prisma client for database access
import prisma from "@/lib/prisma";
// Import UI components for layout and grid
import { Container, Grid3 } from "@/components/ui";
// Import ProductCard component to display each product
import ProductCard from "@/components/ProductCard";

// Search results page
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Get the search query from URL params
  const sp = await searchParams;
  const q = sp?.q?.trim() || "";

  // Type definition for product image
  interface ProductImage {
    id: string;
    url: string;
    alt: string | null;
    productId: string;
  }

  // Type definition for product
  interface Product {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    images: ProductImage[];
    updatedAt: Date;
    currency: string;
    slug: string;
    priceKobo: number;
    stock: number;
    categoryId: string | null;
    // Add other fields as needed
  }

  // Initialize products array
  let products: Product[] = [];
  if (q) {
    // Fetch products matching the search query
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { images: { take: 1 } },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>
        Search Results{q && ` for "${q}"`}
      </h2>
      <Grid3>
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} p={p} />)
        ) : (
          <div>No products found.</div>
        )}
      </Grid3>
    </Container>
  );
}
