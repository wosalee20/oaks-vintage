"use client";
import styled from "styled-components";
import ProductCard from "@/components/ProductCard";

const Wrap = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #222;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
`;

export default function WishlistClient({ products }: { products: any[] }) {
  return (
    <Wrap>
      <Title>Your Wishlist</Title>
      {products.length === 0 ? (
        <p style={{ color: "#666", fontSize: 18 }}>
          No products in your wishlist yet.
        </p>
      ) : (
        <Grid>
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </Grid>
      )}
    </Wrap>
  );
}
