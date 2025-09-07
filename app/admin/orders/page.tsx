import prisma from "@/lib/prisma";
import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";

// Next 15-compliant searchParams type
type OrdersSearchParams = { status?: string };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<OrdersSearchParams>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const status = sp?.status;

  const where: any = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      items: { select: { quantity: true, unitKobo: true } },
    },
    take: 100,
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Orders</h1>

      <form method="get" style={{ display: "flex", gap: 8 }}>
        <select
          name="status"
          defaultValue={status || ""}
          style={{
            height: 40,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "0 10px",
          }}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          type="submit"
          style={{
            height: 40,
            padding: "0 14px",
            borderRadius: 10,
            background: "#111827",
            color: "#fff",
          }}
        >
          Filter
        </button>
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              background: "#fff",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>
                {o.user?.name || o.user?.email || "Customer"} — ₦
                {(o.totalKobo / 100).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {o.items.reduce((s, it) => s + it.quantity, 0)} item(s) ·{" "}
                {o.createdAt.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                alignSelf: "center",
                fontSize: 12,
                color:
                  o.status === "PENDING"
                    ? "#DC2626"
                    : o.status === "PAID"
                    ? "#2563EB"
                    : o.status === "SHIPPED"
                    ? "#059669"
                    : "#6b7280",
              }}
            >
              {o.status}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
