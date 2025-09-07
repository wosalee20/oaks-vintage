import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

import MobileAccountGuest from "@/components/account/MobileAccountGuest";
import MobileAccountSection from "@/components/account/MobileAccountSection";

import {
  MobileWrap,
  HeadBar,
  Welcome,
  Strip,
  LiveChat,
  SectionTitle,
  List,
  Row,
  Desktop,
} from "@/components/account/AccountStyled";
import { Card, Muted, RightChevron } from "@/components/ui";
import { redirect } from "next/navigation";

export default async function AccountHome() {
  const session = await auth();
  if ((session?.user as any)?.role === "ADMIN") redirect("/admin");

  const email = session?.user?.email as string | undefined;
  const displayName =
    (session?.user?.name as string | undefined) ||
    (email ? email.split("@")[0] : "Friend");

  if (!email) {
    return <MobileAccountGuest />;
  }

  const ordersCount = await prisma.order.count({ where: { user: { email } } });

  return (
    <>
      {/* ----- MOBILE ACCOUNT (matches your screenshot) ----- */}
      <MobileWrap>
        <MobileAccountSection
          displayName={displayName}
          email={email}
          ordersCount={ordersCount}
        />
      </MobileWrap>

      {/* ----- DESKTOP (keeps your KPIs) ----- */}
      <Desktop>
        <h2 style={{ fontSize: 26, fontWeight: 700 }}>Welcome, {email}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
        >
          <Card style={{ padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Orders</div>
            <Muted>{ordersCount}</Muted>
          </Card>
          <Card style={{ padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Wishlist</div>
            <Muted>—</Muted>
          </Card>
          <Card style={{ padding: 16 }}>
            <div style={{ fontWeight: 700 }}>Store Credit</div>
            <Muted>₦0.00</Muted>
          </Card>
        </div>
      </Desktop>
    </>
  );
}
