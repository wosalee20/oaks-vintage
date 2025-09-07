"use client";
import Link from "next/link";
import styled from "styled-components";
import { useMemo, useState } from "react";

/* ---------- theme helpers ---------- */
const color = {
  primary: (p: any) => p.theme?.colors?.primary ?? "#2563EB",
  text: (p: any) => p.theme?.colors?.text ?? "#111827",
  border: (p: any) => p.theme?.colors?.border ?? "rgba(0,0,0,.08)",
};

type Category = {
  id: string | number;
  name: string;
  description?: string | null;
  slug?: string | null;
};

/* ---------- layout shells ---------- */
const Shell = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 12px 12px 96px; /* leave space for bottom nav on mobile */
`;

/* ===== MOBILE (<=768px) ===== */
const MobilePane = styled.div`
  display: grid;
  grid-template-columns: 112px 1fr;
  gap: 10px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const SideList = styled.aside`
  display: grid;
  gap: 6px;
  align-content: start;
  position: sticky;
  top: 8px;
  height: fit-content;
`;

const SideItem = styled.button<{ $active?: boolean }>`
  position: relative;
  text-align: left;
  padding: 12px 10px 12px 14px;
  border: 1px solid ${color.border};
  border-radius: 10px;
  background: ${({ $active }) => ($active ? "rgba(37,99,235,.06)" : "#fff")};
  color: ${color.text};
  font-weight: 700;
  line-height: 1.1;
  cursor: pointer;

  /* blue marker on the left when active (like Jumia) */
  &::before {
    content: "";
    position: absolute;
    left: -2px;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: 3px;
    background: ${({ $active }) => ($active ? "#2563EB" : "transparent")};
  }
`;

const ContentCol = styled.div`
  display: grid;
  gap: 12px;
`;

const SectionCard = styled.section`
  background: #fff;
  border: 1px solid ${color.border};
  border-radius: 12px;
  padding: 12px;
`;

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 4px 10px;
`;

const SectionTitle = styled.h2`
  font-weight: 900;
  font-size: 16px;
  color: ${color.text};
`;

const SeeAll = styled(Link)`
  color: ${color.primary};
  font-weight: 800;
  text-decoration: none;
  font-size: 13px;
`;

const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const Tile = styled(Link)`
  display: grid;
  place-items: center;
  gap: 6px;
  height: 86px;
  border: 1px solid ${color.border};
  border-radius: 12px;
  background: #fff;
  text-decoration: none;
  color: ${color.text};
  font-weight: 700;

  &:hover {
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.08);
  }
`;

const Hint = styled.p`
  margin-top: 6px;
  color: rgba(17, 24, 39, 0.6);
  font-size: 12px;
`;

/* ===== DESKTOP (>=769px) – keep your original grid style ===== */
const DesktopOnly = styled.div`
  display: none;
  @media (min-width: 769px) {
    display: block;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 18px;
`;

const CategoryCard = styled(Link)`
  background: #fff;
  border-radius: 12px;
  border: 1px solid ${color.border};
  padding: 20px 16px;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.06s;
  display: grid;
  gap: 8px;
  text-decoration: none;
  color: ${color.text};
  &:hover {
    box-shadow: 0 8px 28px rgba(37, 99, 235, 0.12);
    transform: translateY(-1px);
  }
`;

const CategoryName = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${color.primary};
`;

const CategoryDesc = styled.p`
  color: rgba(17, 24, 39, 0.7);
  font-size: 0.94rem;
`;

export default function CategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const [active, setActive] = useState(0);

  const safeCats = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const current = safeCats[active];

  return (
    <Shell>
      {/* ===== Mobile layout ===== */}
      <MobilePane>
        <SideList>
          {safeCats.map((c, i) => (
            <SideItem
              key={c.id}
              type="button"
              $active={i === active}
              onClick={() => setActive(i)}
            >
              {c.name}
            </SideItem>
          ))}
        </SideList>

        <ContentCol>
          {current && (
            <SectionCard>
              <SectionHead>
                <SectionTitle>{current.name}</SectionTitle>
                <SeeAll href={`/categories/${current.slug ?? current.id}`}>
                  See All
                </SeeAll>
              </SectionHead>

              {/* In the screenshot this area shows many tiles.
                  We only render what we actually have: an “All Products” tile
                  plus optional description as a hint. */}
              <Tiles>
                <Tile href={`/categories/${current.slug ?? current.id}`}>
                  {/* simple iconish grid */}
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="2" />
                    <rect x="14" y="3" width="7" height="7" rx="2" />
                    <rect x="3" y="14" width="7" height="7" rx="2" />
                    <rect x="14" y="14" width="7" height="7" rx="2" />
                  </svg>
                  <span>All Products</span>
                </Tile>
              </Tiles>

              {current.description && <Hint>{current.description}</Hint>}
            </SectionCard>
          )}
        </ContentCol>
      </MobilePane>

      {/* ===== Desktop fallback: your original grid ===== */}
      <DesktopOnly>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#222" }}>
          Shop by Category
        </h1>
        <CategoryGrid>
          {safeCats.map((cat) => (
            <CategoryCard
              key={cat.id}
              href={`/categories/${cat.slug ?? cat.id}`}
            >
              <CategoryName>{cat.name}</CategoryName>
              {cat.description && (
                <CategoryDesc>{cat.description}</CategoryDesc>
              )}
            </CategoryCard>
          ))}
        </CategoryGrid>
      </DesktopOnly>
    </Shell>
  );
}
