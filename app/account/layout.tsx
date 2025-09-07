"use client";
import { Container } from "@/components/ui";
import Link from "next/link";
import styled from "styled-components";

const Shell = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;

  @media (max-width: 1023px) {
    grid-template-columns: 1fr; /* mobile: single column */
  }
`;

const Aside = styled.aside`
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding-right: 16px;

  @media (max-width: 1023px) {
    display: none; /* mobile: hide sidebar to match screenshot */
  }
`;

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container style={{ padding: "12px 16px 96px" }}>
      <Shell>
        <Aside>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>My Account</div>
          <nav style={{ display: "grid", gap: 8, fontSize: 14 }}>
            <Link href="/account">Overview</Link>
            <Link href="/account/orders">Orders</Link>
            <Link href="/account/addresses">Addresses</Link>
            <Link href="/account/profile">Profile</Link>
          </nav>
        </Aside>
        <section>{children}</section>
      </Shell>
    </Container>
  );
}
