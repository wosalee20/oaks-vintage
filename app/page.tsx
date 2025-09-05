import Link from "next/link";
import { Container, Button, Muted } from "@/components/ui";

export default function Home() {
  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <h1
        style={{
          fontSize: 46,
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 12,
        }}
      >
        Crafted. Curated. Vintage.
      </h1>
      <Muted style={{ maxWidth: 680 }}>
        Rare jackets, tees, and accessories — sustainably sourced and restored.
        New drops weekly.
      </Muted>
      <div style={{ marginTop: 18 }}>
        <Button as={Link} href="/products">
          Shop the collection
        </Button>
      </div>
    </Container>
  );
}
