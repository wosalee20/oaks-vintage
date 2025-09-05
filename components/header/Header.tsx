"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCart, IconHelp } from "./icons";
import AccountMenu from "./AccountMenu";
import SearchBar from "./SearchBar";
import MobileDrawer, { MobileHamburger } from "./MobileDrawer";
import { Right, Row, Shell, TopStrip, Wrap, Logo } from "./styles";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Top promo/utility strip */}
      <TopStrip>
        <Shell>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>⭐ Sell on Oaks</div>
            <div />
          </div>
        </Shell>
      </TopStrip>

      <Wrap>
        <Shell>
          <Row>
            {/* left: hamburger + logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="lg:hidden" style={{ display: "block" }}>
                <MobileHamburger onClick={() => setDrawerOpen(true)} />
              </div>
              <Link href="/" aria-label="Oaks Vintage">
                <Logo>
                  OAKS <span className="star" /> <b>VINTAGE</b>
                </Logo>
              </Link>
            </div>

            {/* center: search */}
            <SearchBar />

            {/* right: account / help / cart */}
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
                }}
              >
                <IconCart /> <span className="label">Cart</span>
              </Link>
            </Right>
          </Row>
        </Shell>
      </Wrap>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
