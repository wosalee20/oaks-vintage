// This is a client component for the search input and filtered product list.
// It fetches all products on mount and filters them in the browser as the user types.
// For large datasets, you would want to filter on the server instead.

"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Container, Grid3 } from "@/components/ui";

export default function ProductSearch({
  initialProducts,
}: {
  initialProducts: any[];
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);

  // Filter products in the browser as the user types
  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          (p.description &&
            p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : products;

  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 18 }}>
        Products
      </h2>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 400,
          marginBottom: 24,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 16,
        }}
      />
      <Grid3>
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {filtered.length === 0 && <div>No products found.</div>}
      </Grid3>
    </Container>
  );
}
