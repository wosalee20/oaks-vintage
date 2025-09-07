import prisma from "@/lib/prisma";
import DiscountForm from "../../../components/admin/DiscountForm";
import { requireAdmin } from "@/lib/requireAdmin";
import type { Discount } from "@prisma/client";

export default async function DiscountsPage() {
  await requireAdmin();
  const list = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>
        Discount Codes
      </h1>

      <DiscountForm />

      <div style={{ display: "grid", gap: 10 }}>
        {list.map((d: Discount) => (
          <DiscountForm key={d.id} discount={d} />
        ))}
      </div>
    </div>
  );
}
