import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Divider, Muted } from "@/components/ui";

export default async function OrdersPage() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;

  const orders = email
    ? await prisma.order.findMany({
        where: { user: { email } },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Your Orders
      </h2>
      {orders.length === 0 && <Muted>No orders yet.</Muted>}
      <div style={{ display: "grid", gap: 12 }}>
        {orders.map((o) => (
          <Card key={o.id} style={{ padding: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <b>#{o.id.slice(0, 8)}</b> · {o.status} · ₦
                {(o.totalKobo / 100).toLocaleString()}
              </div>
              <Muted>
                {o.createdAt.toDateString?.() ||
                  new Date(o.createdAt).toDateString()}
              </Muted>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {o.items.map((it) => (
                <li key={it.id}>
                  {it.quantity} × {it.product.title}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
