"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import {
  IconCart,
  IconHelp,
  IconHeart,
  IconUser,
  IconHome,
  IconHomeFill,
  IconGrid,
} from "./icons";
import AccountMenu from "./AccountMenu";
import SearchBar from "./SearchBar";
import MobileDrawer, { MobileHamburger } from "./MobileDrawer";
import { Right, Row, Shell, TopStrip, Wrap, Logo, SearchSlot } from "./styles";
import styled from "styled-components";

/* ===== mobile bottom bar ===== */
const BottomBar = styled.nav`
  position: fixed;
  inset: auto 0 0 0;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
  z-index: 2147483000;
  pointer-events: auto;
  @media (min-width: 1024px) {
    display: none;
  }
`;

const Item = styled(Link)<{ $active?: boolean }>`
  display: grid;
  place-items: center;
  gap: 4px;
  text-align: center;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  padding: 4px 0;
`;

const CartWrap = styled(Link)<{ $active?: boolean }>`
  position: relative;
  display: grid;
  place-items: center;
  gap: 4px;
  text-align: center;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-size: 12px;
  font-weight: 700;

  & > span.badge {
    position: absolute;
    top: -2px;
    right: 26%;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border-radius: 999px;
    min-width: 16px;
    height: 16px;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    font-weight: 800;
  }
`;

/* =========================================================
   Guard wrapper: decide whether to render the storefront header.
   This avoids calling useCart() on /admin where the CartProvider
   is intentionally not mounted.
========================================================= */
export default function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null; // hide entirely on admin
  return <HeaderInner />;
}

/* =========================================================
   Actual header content (storefront only)
========================================================= */
function HeaderInner() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname?.startsWith("/?");

  return (
    <>
      {/* Desktop-only info strip; (TopStrip itself can be styled to hide on mobile if desired) */}
      <TopStrip>CALL TO ORDER: 07006000000, 02018883300</TopStrip>

      <Wrap>
        <Shell>
          <Row>
            {/* left (hidden on mobile so only the search stays on top) */}
            <div style={{ display: "none" }}>
              <MobileHamburger onClick={() => setDrawerOpen(true)} />
              <Link href="/" aria-label="Oaks Vintage">
                <Logo>
                  OAKS <span className="star" /> <b>VINTAGE</b>
                </Logo>
              </Link>
            </div>

            {/* center: search occupies full width on mobile */}
            <SearchSlot>
              <SearchBar />
            </SearchSlot>

            {/* right actions (desktop only via CSS in ./styles) */}
            <Right>
              <AccountMenu />
              <Link
                href="/help"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 40,
                  padding: "0 12px",
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: 10,
                }}
              >
                <IconHelp /> <span className="label">Help</span>
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  height: 40,
                  padding: "0 12px",
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: 10,
                  position: "relative",
                }}
              >
                <IconCart />
                {count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "#2563EB",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: 20,
                      height: 20,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 6px",
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                )}
                <span className="label">Cart</span>
              </Link>
            </Right>
          </Row>
        </Shell>
      </Wrap>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Fixed mobile bottom nav (blue), rendered on every non-admin page */}
      <BottomBar>
        <Item href="/" aria-label="Home" $active={isHome}>
          {isHome ? <IconHomeFill /> : <IconHome />}
          <span>Home</span>
        </Item>

        <Item
          href="/categories"
          aria-label="Categories"
          $active={pathname?.startsWith("/categories")}
        >
          <IconGrid />
          <span>Categories</span>
        </Item>

        <CartWrap href="/cart" aria-label="Cart" $active={pathname === "/cart"}>
          <IconCart />
          {count > 0 && <span className="badge">{count}</span>}
          <span>Cart</span>
        </CartWrap>

        <Item
          href="/wishlist"
          aria-label="Wishlist"
          $active={pathname?.startsWith("/wishlist")}
        >
          <IconHeart />
          <span>Wishlist</span>
        </Item>

        <Item
          href="/account"
          aria-label="Account"
          $active={pathname?.startsWith("/account")}
        >
          <IconUser />
          <span>Account</span>
        </Item>
      </BottomBar>
    </>
  );
}
