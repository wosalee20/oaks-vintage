"use client";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import QuickAdd from "@/components/cart/QuickAdd";

const Card = styled.div`
  display: grid;
  gap: 8px;
`;
const Thumb = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f7f9fc;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme?.colors?.border ?? "rgba(0,0,0,.08)"};
`;
const Title = styled(Link)`
  color: ${({ theme }) => theme?.colors?.text ?? "#111827"};
  font-size: 14px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;
const Price = styled.div`
  color: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  font-weight: 800;
  font-size: 18px;
`;
const OldPrice = styled.div`
  color: rgba(17, 24, 39, 0.45);
  text-decoration: line-through;
  font-size: 13px;
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(17, 24, 39, 0.65);
  font-size: 12px;
`;

export default function ProductCard({ p }: { p: any }) {
  const cover = p.images?.[0];
  const compareAtKobo: number | undefined = undefined;
  const rating: number | undefined = undefined;
  const sold: string | undefined = undefined;

  return (
    <Card>
      <Thumb>
        {cover?.url && (
          <Link href={`/products/${p.slug}`} aria-label={p.title}>
            <Image
              src={cover.url}
              alt={cover.alt || p.title}
              fill
              sizes="(max-width:768px) 50vw, 20vw"
            />
          </Link>
        )}
        <div style={{ position: "absolute", right: 10, bottom: 10 }}>
          <QuickAdd productId={p.id} />
        </div>
      </Thumb>

      <Title href={`/products/${p.slug}`}>{p.title}</Title>

      <PriceRow>
        <Price>₦{(p.priceKobo / 100).toLocaleString()}</Price>
        {typeof compareAtKobo === "number" && (
          <OldPrice>₦{(compareAtKobo / 100).toLocaleString()}</OldPrice>
        )}
      </PriceRow>

      {(rating || sold) && (
        <Meta>
          {rating && <span>{"★".repeat(Math.round(rating))}</span>}
          {sold && <span>{sold}</span>}
        </Meta>
      )}
    </Card>
  );
}
