import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

type ProductsSearchParams = {
  q?: string;
  active?: string; // "true" | "false" | undefined
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const sp = await searchParams;
  const q = (sp?.q ?? "").trim();
  const active = sp?.active;

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }
  if (active === "true") where.isActive = true;
  if (active === "false") where.isActive = false;

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      isActive: true,
      stock: true,
      priceKobo: true,
      images: { select: { url: true }, take: 1 },
      category: { select: { name: true } },
    },
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Products</h1>
        <Link
          href="/admin/products/new"
          style={{
            background: "#2563EB",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          New Product
        </Link>
      </div>

      <form method="get" style={{ display: "flex", gap: 8 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title or slug…"
          style={{
            height: 40,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "0 12px",
            flex: 1,
          }}
        />
        <select
          name="active"
          defaultValue={active || ""}
          style={{
            height: 40,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "0 10px",
          }}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 10,
              background: "#fff",
              textDecoration: "none",
              color: "#111827",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                background: "#f3f4f6",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {p.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0].url}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : null}
            </div>
            <div style={{ display: "grid", alignContent: "center", gap: 2 }}>
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                ₦{(p.priceKobo / 100).toLocaleString()} ·{" "}
                {p.category?.name || "No category"} · {p.stock} in stock
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: p.isActive ? "#059669" : "#DC2626",
                }}
              >
                {p.isActive ? "Active" : "Inactive"} · /{p.slug}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
