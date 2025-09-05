import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Muted } from "@/components/ui";

export default async function AccountHome() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;

  const [ordersCount] = await Promise.all([
    email
      ? prisma.order.count({ where: { user: { email } } })
      : Promise.resolve(0),
  ]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2 style={{ fontSize: 26, fontWeight: 700 }}>
        Welcome{email ? `, ${email}` : ""}
      </h2>
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
    </div>
  );
}
