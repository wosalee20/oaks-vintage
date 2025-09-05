import { Container } from "@/components/ui";
import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container style={{ padding: "28px 16px 40px" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}
      >
        <aside
          style={{
            borderRight: "1px solid rgba(255,255,255,.1)",
            paddingRight: 16,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 12 }}>My Account</div>
          <nav style={{ display: "grid", gap: 8, fontSize: 14 }}>
            <Link href="/account">Overview</Link>
            <Link href="/account/orders">Orders</Link>
            <Link href="/account/addresses">Addresses</Link>
            <Link href="/account/profile">Profile</Link>
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </Container>
  );
}
