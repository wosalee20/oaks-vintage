"use client";
import styled from "styled-components";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const CategoryName = styled.h1`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
`;

const Wrap = styled.div`
  max-width: ${({ theme }) => theme?.layout?.max ?? 1180}px;
  margin: 0 auto;
  padding: 16px;
`;

const Header = styled.header`
  display: grid;
  gap: 6px;
  margin: 6px 0 14px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
`;

const Breadcrumb = styled.nav`
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.muted ?? "rgba(17,24,39,.62)"};
  a {
    color: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
    text-decoration: none;
    font-weight: 700;
  }
`;

const Desc = styled.p`
  color: ${({ theme }) => theme?.colors?.muted ?? "rgba(17,24,39,.62)"};
  max-width: 70ch;
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
  a {
    border: 1px solid
      ${({ theme }) => theme?.colors?.border ?? "rgba(0,0,0,.08)"};
    background: #fff;
    color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 600;
    text-decoration: none;
  }
`;

export default function CategoryClient({
  category,
  products,
  hasMore,
  page,
  slug,
}: {
  category: any;
  products: any[];
  hasMore: boolean;
  page: number;
  slug: string;
}) {
  if (!category) return null;
  return (
    <Wrap>
      <Header>
        <Breadcrumb>
          <Link href="/categories">Categories</Link> &nbsp; / &nbsp;
          <span>{category.name}</span>
        </Breadcrumb>
        <Title>{category.name}</Title>
        {category.description && <Desc>{category.description}</Desc>}
      </Header>

      <Grid>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </Grid>

      {hasMore && (
        <Pager>
          <Link
            href={`/categories/${slug}?page=${page + 1}`}
            aria-label="Load more"
          >
            Load more
          </Link>
        </Pager>
      )}
    </Wrap>
  );
}
