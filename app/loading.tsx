"use client";
import styled from "styled-components";
const Wrap = styled.div`
  max-width: ${({ theme }) => theme?.layout?.max ?? 1180}px;
  margin: 0 auto;
  padding: 16px;
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
const Sk = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(90deg, #f3f4f6 25%, #eef1f6 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: sh 1.2s ease-in-out infinite;
  aspect-ratio: 1/1;
  @keyframes sh {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
`;
export default function Loading() {
  return (
    <Wrap>
      <Grid>
        {Array.from({ length: 20 }).map((_, i) => (
          <Sk key={i} />
        ))}
      </Grid>
    </Wrap>
  );
}
