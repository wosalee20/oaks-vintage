import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, Button, Card, Divider, Muted } from "@/components/ui";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
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
          <form action="/api/cart" method="post" style={{ marginTop: 18 }}>
            <input type="hidden" name="productId" value={product.id} />
            <Button type="submit">Add to cart</Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
