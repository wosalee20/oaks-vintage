// Import Prisma client for database access
import prisma from "@/lib/prisma";
// Import Next.js Link component
import Link from "next/link";
// Import BannerRow component for displaying banners
import BannerRow from "@/components/admin/BannerRow";
// Import admin authentication/authorization utility
import { requireAdmin } from "@/lib/requireAdmin";

// NOTE: we use `include` for relations so all scalar fields (like trackingCode) are returned.
// No explicit `select` for scalars to avoid type issues if you just added fields.

// Discount type definition for admin dashboard
interface Discount {
  id: string;
  code: string;
  type: "PERCENT" | "AMOUNT";
  value: number;
  active: boolean;
  startsAt: string | Date | null;
  endsAt: string | Date | null;
}

// Admin dashboard page
export default async function AdminHome() {
  // Ensure the user is an admin
  await requireAdmin();

  // Calculate KPIs for the last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  // Fetch dashboard metrics and data in parallel
  const [
    products,
    orders,
    customers,
    lowStock,
    revenueAgg,
    activeDiscounts,
    banners,
    latestOrders,
    latestDiscounts,
    logs,
  ] = await Promise.all([
    prisma.product.count(), // Total products
    prisma.order.count(), // Total orders
    prisma.user.count({ where: { role: "USER" } }), // Total customers
    prisma.product.count({ where: { stock: { lte: 3 } } }), // Low stock products
    prisma.order.aggregate({
      _sum: { totalKobo: true },
      where: { status: { in: ["PAID", "SHIPPED"] }, createdAt: { gte: since } },
    }), // Revenue aggregation
    prisma.discount.count({ where: { active: true } }), // Active discounts
    prisma.banner.findMany({ orderBy: { order: "asc" } }), // Banners
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        items: { select: { quantity: true } },
      },
      take: 8,
    }),
    prisma.discount.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.adminActivityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { actor: { select: { email: true, name: true } } },
    }),
  ]);

  const revenue30d = (revenueAgg._sum.totalKobo || 0) / 100;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Dashboard</h1>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        <KPI label="Products" value={products} />
        <KPI label="Orders" value={orders} />
        <KPI label="Customers" value={customers} />
        <KPI label="Low stock (≤3)" value={lowStock} />
        <KPI label="Revenue (30d)" value={`₦${revenue30d.toLocaleString()}`} />
        <KPI label="Active discounts" value={activeDiscounts} />
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <QBtn href="/admin/products/new">+ New product</QBtn>
        <QBtn href="/admin/discounts">+ New discount</QBtn>
        <QBtn href="/admin/banners">Manage banners</QBtn>
        <QBtn href="/admin/orders">View orders</QBtn>
      </div>

      {/* BANNERS MANAGER (inline) */}
      <Section title="Homepage Banners">
        {banners.length < 3 && <BannerRow />}
        <div style={{ display: "grid", gap: 10 }}>
          {banners.map((b: any, i: number) => (
            <BannerRow key={b.id} banner={b} index={i} total={banners.length} />
          ))}
        </div>
      </Section>

      {/* LATEST ORDERS */}
      <Section title="Recent Orders" moreHref="/admin/orders">
        <div style={{ display: "grid", gap: 8 }}>
          {latestOrders.map((o) => (
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
                  {((o as any).totalKobo / 100).toLocaleString()}
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
                    (o as any).status === "PENDING"
                      ? "#DC2626"
                      : (o as any).status === "PAID"
                      ? "#2563EB"
                      : (o as any).status === "SHIPPED"
                      ? "#059669"
                      : "#6b7280",
                }}
              >
                {(o as any).status}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* DISCOUNTS */}
      <Section title="Discounts" moreHref="/admin/discounts">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 10,
          }}
        >
          {latestDiscounts.map((d) => (
            <div
              key={d.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 900 }}>{d.code}</div>
              <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                {d.type === "PERCENT"
                  ? `${d.value}%`
                  : `₦${(d.value / 100).toLocaleString()}`}{" "}
                · {d.active ? "Active" : "Inactive"}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AUDIT LOG */}
      <Section title="Audit Log" moreHref="/admin/audit-log">
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead
              style={{ background: "#f9fafb", color: "#6b7280", fontSize: 12 }}
            >
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>
                  Time
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>
                  Actor
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>
                  Action
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>
                  Entity
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l: AdminActivityLog) => (
                <tr key={l.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px" }}>
                    {l.createdAt.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    {l.actor.name || l.actor.email}
                  </td>
                  <td style={{ padding: "10px 12px" }}>{l.action}</td>
                  <td style={{ padding: "10px 12px" }}>{l.entity}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>
                    {l.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

interface AdminActivityLog {
  id: string;
  createdAt: Date;
  action: string;
  entity: string;
  entityId: string;
  actor: AdminActor;
}

interface AdminActor {
  email: string | null;
  name: string | null;
}

// KPI component definition
function KPI({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: 70,
        justifyContent: "center",
      }}
    >
      <div style={{ color: "rgba(17,24,39,.65)", fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 22 }}>{value}</div>
    </div>
  );
}

function Section({
  title,
  moreHref,
  children,
}: {
  title: string;
  moreHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>{title}</h2>
        {moreHref ? (
          <Link href={moreHref} style={{ fontSize: 13, color: "#2563EB" }}>
            View all →
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function QBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        background: "#2563EB",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 10,
        textDecoration: "none",
        fontWeight: 800,
      }}
    >
      {children}
    </Link>
  );
}
