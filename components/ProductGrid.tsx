"use client";
import styled from "styled-components";
import ProductCard from "@/components/ProductCard";

const Wrap = styled.div`
  max-width: ${({ theme }) => theme?.layout?.max ?? 1180}px;
  margin: 0 auto;
  padding: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Pager = styled.div`
  display: flex;
  justify-content: center;
  margin: 22px 0 10px;
  a,
  button {
    border: 1px solid
      ${({ theme }) => theme?.colors?.border ?? "rgba(0,0,0,.08)"};
    background: #fff;
    color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 600;
  }
`;

export default function ProductGrid({
  products,
  hasMore,
  page,
}: {
  products: any[];
  hasMore: boolean;
  page: number;
}) {
  return (
    <Wrap>
      <Grid>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </Grid>
      {hasMore && (
        <Pager>
          <a href={`/?page=${page + 1}`} aria-label="Load more">
            Load more
          </a>
        </Pager>
      )}
    </Wrap>
  );
}
