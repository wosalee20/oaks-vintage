"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/requireAdmin";
import { auditLog } from "@/lib/audit";

function cleanUrl(s: string) {
  return (s || "").trim();
}

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const image = cleanUrl(String(formData.get("image") || ""));
  const link = cleanUrl(String(formData.get("link") || ""));
  const alt = String(formData.get("alt") || "");
  const active = String(formData.get("active") || "") === "on";

  // limit to 3 total banners
  const count = await prisma.banner.count();
  if (count >= 3) return { ok: false, error: "Maximum of 3 banners allowed." };

  const maxOrder = await prisma.banner.aggregate({ _max: { order: true } });
  const created = await prisma.banner.create({
    data: {
      image,
      link: link || null,
      alt: alt || null,
      active,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  await auditLog({
    action: "banner.create",
    entity: "Banner",
    entityId: created.id,
    after: created,
  });
  revalidatePath("/admin/banners");
  revalidatePath("/"); // homepage
  return { ok: true, id: created.id };
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdmin();
  const prev = await prisma.banner.findUnique({ where: { id } });
  if (!prev) return { ok: false, error: "Not found" };

  const image = cleanUrl(String(formData.get("image") || prev.image));
  const link = cleanUrl(String(formData.get("link") || "")) || null;
  const alt = String(formData.get("alt") || "") || null;
  const active =
    String(formData.get("active") || (prev.active ? "on" : "")) === "on";

  const updated = await prisma.banner.update({
    where: { id },
    data: { image, link, alt, active },
  });

  await auditLog({
    action: "banner.update",
    entity: "Banner",
    entityId: id,
    before: prev,
    after: updated,
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const prev = await prisma.banner.findUnique({ where: { id } });
  await prisma.banner.delete({ where: { id } });
  await auditLog({
    action: "banner.delete",
    entity: "Banner",
    entityId: id,
    before: prev ?? undefined,
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function moveBanner(id: string, dir: -1 | 1) {
  await requireAdmin();
  interface Banner {
    id: string;
    image: string;
    link: string | null;
    alt: string | null;
    active: boolean;
    order: number;
  }

  const list: Banner[] = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });
  const idx: number = list.findIndex((b: Banner) => b.id === id);
  if (idx < 0) return { ok: false };
  const j = idx + dir;
  if (j < 0 || j >= list.length) return { ok: true }; // nothing to do

  // swap orders
  const a = list[idx],
    b = list[j];
  await prisma.$transaction([
    prisma.banner.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.banner.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  await auditLog({
    action: "banner.reorder",
    entity: "Banner",
    entityId: id,
    before: { from: idx },
    after: { to: j },
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}
