import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/prisma";

export async function GET() {
  await requireAdmin();
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json(cats);
}
