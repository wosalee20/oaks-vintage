"use client";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui";

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  background: rgba(255, 255, 255, 0.06);
`;
const Body = styled.div`
  padding: 12px 14px;
`;
const Title = styled.div`
  font-weight: 600;
`;
const Price = styled.div`
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
`;

export default function ProductCard({ p }: { p: any }) {
  const cover = p.images?.[0];
  return (
    <Link href={`/products/${p.slug}`}>
      <Card>
        <Thumb>
          {cover?.url && (
            <Image
              src={cover.url}
              alt={cover.alt || p.title}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
            />
          )}
        </Thumb>
        <Body>
          <Title>{p.title}</Title>
          <Price>₦{(p.priceKobo / 100).toLocaleString()}</Price>
        </Body>
      </Card>
    </Link>
  );
}
