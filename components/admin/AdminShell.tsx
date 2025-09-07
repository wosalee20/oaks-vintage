"use client";

import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

/* ================== Layout ================== */
const Frame = styled.div`
  --primary: ${({ theme }) => theme?.colors?.primary ?? "#2563EB"};
  --primaryDark: ${({ theme }) => theme?.colors?.primaryDark ?? "#1D4ED8"};
  --border: rgba(0, 0, 0, 0.08);

  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* ====== Mobile TopNav (fixed; brand + title + 2x3 tabs) ====== */
const TopNav = styled.header`
  display: none;

  @media (max-width: 960px) {
    display: grid;
    grid-template-rows: 56px auto auto;
    row-gap: 6px;

    position: fixed;
    top: 0;
    inset-inline: 0;
    z-index: 100;

    background: #fff;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 10px;
`;

const TopNavBrand = styled.div`
  font-weight: 900;
  font-size: 18px;
  color: var(--primary);
  letter-spacing: 0.5px;
`;

const TopNavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TopNavLogout = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;

  font-weight: 800;
  font-size: 14px;

  color: #fff;
  background: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.18);
  transition: background 0.15s ease, transform 0.06s ease;

  &:hover {
    background: #dc2626;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 3px solid rgba(239, 68, 68, 0.25);
    outline-offset: 2px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px 6px;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
`;

/* Tabs grid: 3 columns, 2 rows */
const TabsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 0 10px 10px;
`;

const TabBox = styled(Link)<{ $active?: boolean }>`
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  display: grid;
  place-items: center;

  text-decoration: none;
  font-weight: 800;
  font-size: 14px;

  background: ${({ $active }) => ($active ? "var(--primary)" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#111827")};

  transition: background 0.15s ease, color 0.15s ease, transform 0.06s ease;
  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--primaryDark)" : "rgba(37,99,235,.06)"};
  }
  &:active {
    transform: translateY(1px);
  }
`;

const MoreBtn = styled.button<{ $open?: boolean }>`
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: ${({ $open }) => ($open ? "var(--primaryDark)" : "#fff")};
  color: ${({ $open }) => ($open ? "#fff" : "#111827")};
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;

  transition: background 0.15s ease, color 0.15s ease, transform 0.06s ease;
  &:hover {
    background: ${({ $open }) =>
      $open ? "var(--primaryDark)" : "rgba(37,99,235,.06)"};
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* Popover for extra tabs */
const PopMask = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: ${({ open }) => (open ? "block" : "none")};
  z-index: 120;
`;

const Pop = styled.div`
  position: fixed;
  left: 10px;
  right: 10px;
  top: 140px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  z-index: 130;
  padding: 8px;
  display: grid;
  gap: 6px;
`;

const PopItem = styled(Link)`
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  color: #111827;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  &:hover {
    background: rgba(37, 99, 235, 0.06);
  }
`;

/* ========== Desktop sidebar ========== */
const Side = styled.aside`
  border-right: 1px solid var(--border);
  background: #fff;

  @media (max-width: 960px) {
    display: none;
  }
`;

const Brand = styled.div`
  padding: 18px 16px;
  font-weight: 900;
  font-size: 18px;
  color: var(--primary);
`;

const Nav = styled.nav`
  display: grid;
  gap: 4px;
  padding: 8px;
`;

const Item = styled(Link)<{ $active?: boolean }>`
  padding: 10px 12px;
  border-radius: 10px;
  color: #111827;
  text-decoration: none;
  background: ${({ $active }) =>
    $active ? "rgba(37,99,235,.08)" : "transparent"};
  &:hover {
    background: rgba(37, 99, 235, 0.08);
  }
`;

/* ========== Main content ========== */
const Main = styled.main`
  background: #f7f8fb;
  min-height: 100vh;
  padding: 16px;

  /* leave room for fixed TopNav on mobile */
  @media (max-width: 960px) {
    padding-top: 188px; /* brand(56) + title(~36) + 2 rows tabs(44*2 + gaps) */
  }
`;

/* ========== Shared logout handler ========== */
async function doLogout() {
  try {
    await signOut({ redirect: false });
  } finally {
    window.location.assign("/"); // clean exit
  }
}

/* ========== Routes (single source of truth) ========== */
const allRoutes = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/audit-log", label: "Audit Log" }, // goes under "More"
];

/* We will show the first 5 + a “More” box = 6 boxes (3x2).
   “More” contains any remaining routes (here: Audit Log). */
const primaryTabs = allRoutes.slice(0, 5);
const overflowTabs = allRoutes.slice(5);

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const is = (p: string) => path === p || path?.startsWith(p + "/");
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <Frame>
      {/* ===== MOBILE TOP NAV ===== */}
      <TopNav>
        <TopRow>
          <TopNavBrand>OV Admin</TopNavBrand>
          <TopNavActions>
            <TopNavLogout onClick={doLogout}>Logout</TopNavLogout>
          </TopNavActions>
        </TopRow>

        <TitleRow>Admin Dashboard</TitleRow>

        {/* Two rows, three columns */}
        <TabsGrid>
          {primaryTabs.slice(0, 5).map((r) => (
            <TabBox key={r.href} href={r.href} $active={is(r.href)}>
              {r.label}
            </TabBox>
          ))}
          <MoreBtn
            type="button"
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            $open={moreOpen}
          >
            More
          </MoreBtn>
        </TabsGrid>

        {/* simple popover for overflow */}
        {moreOpen && (
          <>
            <PopMask open onClick={() => setMoreOpen(false)} />
            <Pop onClick={(e) => e.stopPropagation()}>
              {overflowTabs.map((r) => (
                <PopItem
                  key={r.href}
                  href={r.href}
                  onClick={() => setMoreOpen(false)}
                >
                  {r.label}
                </PopItem>
              ))}
            </Pop>
          </>
        )}
      </TopNav>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <Side>
        <Brand>OV Admin</Brand>
        <Nav>
          {allRoutes.map((r) => (
            <Item key={r.href} href={r.href} $active={is(r.href)}>
              {r.label}
            </Item>
          ))}
        </Nav>
        <div style={{ padding: 8 }}>
          <button
            onClick={doLogout}
            style={{
              width: "100%",
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#ef4444",
              color: "#fff",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </Side>

      {/* ===== MAIN CONTENT ===== */}
      <Main>{children}</Main>
    </Frame>
  );
}
