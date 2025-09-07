import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Card, Divider, Muted } from "@/components/ui";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { images: true, category: true },
  });
  if (!product) return notFound();

  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "1fr",
          alignItems: "start",
        }}
      >
        <div>
          {product.images.map((img) => (
            <Card
              key={img.id}
              style={{
                position: "relative",
                aspectRatio: "4/3",
                marginBottom: 12,
              }}
            >
              <Image src={img.url} alt={img.alt || product.title} fill />
            </Card>
          ))}
        </div>

        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>{product.title}</h1>
          <Muted style={{ marginTop: 8 }}>
            ₦{(product.priceKobo / 100).toLocaleString()}
          </Muted>
          <Divider style={{ margin: "16px 0" }} />
          <p style={{ color: "rgba(255,255,255,.85)" }}>
            {product.description}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </Container>
  );
}
