import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateOrder } from "@/app/admin/orders/actions";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  await requireAdmin();

  const o = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: { select: { email: true, name: true } },
      address: {
        select: {
          id: true,
          phone: true,
          userId: true,
          fullName: true,
          line1: true,
          line2: true,
          city: true,
          state: true,
          country: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          unitKobo: true,
          product: { select: { title: true, slug: true } },
        },
      },
      payment: true,
    },
  });
  if (!o) return notFound();

  // Type assertion to help TypeScript recognize trackingCode and other scalars
  type OrderWithRelations = typeof o & { trackingCode?: string };
  const order = o as OrderWithRelations;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>
        Order #{order.id.slice(0, 8)}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 10 }}>
          {/* items */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Items</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{ textAlign: "left", color: "#6b7280", fontSize: 12 }}
                >
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td>{it.product.title}</td>
                    <td>{it.quantity}</td>
                    <td>₦{(it.unitKobo / 100).toLocaleString()}</td>
                    <td>
                      ₦{((it.unitKobo * it.quantity) / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* customer & address */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Customer</div>
            <div>{order.user?.name || order.user?.email || "Customer"}</div>
            {order.address && (
              <div style={{ marginTop: 8, color: "#6b7280" }}>
                {order.address.fullName}
                <br />
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}
                <br />
                {order.address.city}
                {order.address.state ? `, ${order.address.state}` : ""}
                <br />
                {order.address.country}
                {order.address.phone ? ` · ${order.address.phone}` : ""}
              </div>
            )}
          </div>
        </div>

        {/* summary + actions */}
        <div style={{ display: "grid", gap: 10 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 800 }}>Total</div>
              <div style={{ fontWeight: 800 }}>
                ₦{(order.totalKobo / 100).toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
              Status: <strong>{order.status}</strong>
              {order.trackingCode ? (
                <span style={{ marginLeft: 8 }}>
                  · Tracking: <strong>{order.trackingCode}</strong>
                </span>
              ) : null}
            </div>

            <form
              action={async (fd) => {
                "use server";
                await updateOrder(order.id, fd);
              }}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
                display: "grid",
                gap: 10,
              }}
            >
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Status</span>
                <select
                  name="status"
                  defaultValue={order.status}
                  style={{
                    height: 42,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "0 10px",
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>
                  Tracking code
                </span>
                <input
                  name="trackingCode"
                  defaultValue={order.trackingCode ?? ""}
                  placeholder="e.g., 1Z..."
                  style={{
                    height: 42,
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "0 10px",
                  }}
                />
              </label>

              <button
                type="submit"
                style={{
                  height: 42,
                  borderRadius: 10,
                  background: "#2563EB",
                  color: "#fff",
                  fontWeight: 800,
                  border: 0,
                }}
              >
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
