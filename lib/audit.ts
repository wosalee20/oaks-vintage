import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/auth";

type LogOpts = {
  action: string;
  entity: string;
  entityId: string;
  before?: any;
  after?: any;
};

export async function auditLog({
  action,
  entity,
  entityId,
  before,
  after,
}: LogOpts) {
  try {
    const session = await auth();
    const actorId = (session?.user as any)?.id;
    if (!actorId) return;

    const h = await headers();
    const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || undefined;
    const ua = h.get("user-agent") || undefined;

    await prisma.adminActivityLog.create({
      data: { actorId, action, entity, entityId, before, after, ip, ua },
    });
  } catch {
    // avoid blocking the actual action
  }
}
