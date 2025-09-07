"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { auditLog } from "@/lib/audit";
import { OrderStatus } from "@prisma/client";

export async function updateOrder(id: string, formData: FormData) {
  await requireAdmin();
  const prev = await prisma.order.findUnique({ where: { id } });
  if (!prev) return { ok: false, error: "Not found" };

  const status = String(formData.get("status") || prev.status) as OrderStatus;
  // trackingCode removed as it does not exist on the Order model

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  await auditLog({
    action: "order.update",
    entity: "Order",
    entityId: id,
    before: prev,
    after: updated,
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true };
}
