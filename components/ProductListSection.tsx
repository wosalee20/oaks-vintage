"use client";
import styled from "styled-components";
import ProductCard from "@/components/ProductCard";
// import BannerCarousel from "@/components/home/BannerCarousel"; // keep if you want it above

const Wrap = styled.div`
  max-width: ${({ theme }) => theme?.layout?.max ?? 1180}px;
  margin: 0 auto;
  padding: 0 16px 16px;
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, 1fr);
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

type Product = { id: string | number; [k: string]: any };
type Slide = { src: string; alt: string; [k: string]: any };

export default function ProductListSection({
  products,
  slides,
}: {
  products: Product[];
  slides: Slide[];
}) {
  return (
    <>
      {/* <BannerCarousel /> */}{" "}
      {/* you already render banners on home; keep or remove */}
      <Wrap>
        <Grid>
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </Grid>
      </Wrap>
    </>
  );
}
