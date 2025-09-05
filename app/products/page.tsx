import prisma from "@/lib/prisma";
import { Container, Grid3 } from "@/components/ui";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>
        Products
      </h2>
      <Grid3>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </Grid3>
    </Container>
  );
}
