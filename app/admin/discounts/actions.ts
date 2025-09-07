"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { auditLog } from "@/lib/audit";
import { DiscountType } from "@prisma/client";

export async function createDiscount(fd: FormData) {
  await requireAdmin();
  const code = String(fd.get("code") || "")
    .toUpperCase()
    .replace(/\s+/g, "");
  const type = String(fd.get("type") || "PERCENT") as DiscountType;
  const value = Math.max(0, Math.round(Number(fd.get("value") || 0)));
  const startsAt = fd.get("startsAt")
    ? new Date(String(fd.get("startsAt")))
    : null;
  const endsAt = fd.get("endsAt") ? new Date(String(fd.get("endsAt"))) : null;
  const maxUses = fd.get("maxUses")
    ? Math.max(0, Number(fd.get("maxUses")))
    : null;
  const active = String(fd.get("active") || "") === "on";

  const created = await prisma.discount.create({
    data: { code, type, value, startsAt, endsAt, maxUses, active },
  });

  await auditLog({
    action: "discount.create",
    entity: "Discount",
    entityId: created.id,
    after: created,
  });
  revalidatePath("/admin/discounts");
  return { ok: true };
}

export async function updateDiscount(id: string, fd: FormData) {
  await requireAdmin();
  const prev = await prisma.discount.findUnique({ where: { id } });
  if (!prev) return { ok: false };

  const code = String(fd.get("code") || prev.code)
    .toUpperCase()
    .replace(/\s+/g, "");
  const type = String(fd.get("type") || prev.type) as any;
  const value = Math.max(0, Math.round(Number(fd.get("value") ?? prev.value)));
  const startsAt = fd.get("startsAt")
    ? new Date(String(fd.get("startsAt")))
    : prev.startsAt;
  const endsAt = fd.get("endsAt")
    ? new Date(String(fd.get("endsAt")))
    : prev.endsAt;
  const maxUses = fd.get("maxUses")
    ? Math.max(0, Number(fd.get("maxUses")))
    : prev.maxUses;
  const active = String(fd.get("active") || (prev.active ? "on" : "")) === "on";

  const updated = await prisma.discount.update({
    where: { id },
    data: { code, type, value, startsAt, endsAt, maxUses, active },
  });

  await auditLog({
    action: "discount.update",
    entity: "Discount",
    entityId: id,
    before: prev,
    after: updated,
  });
  revalidatePath("/admin/discounts");
  return { ok: true };
}

export async function deleteDiscount(id: string) {
  await requireAdmin();
  const prev = await prisma.discount.findUnique({ where: { id } });
  await prisma.discount.delete({ where: { id } });
  await auditLog({
    action: "discount.delete",
    entity: "Discount",
    entityId: id,
    before: prev ?? undefined,
  });
  revalidatePath("/admin/discounts");
  return { ok: true };
}
