import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { identifier } = await req.json().catch(() => ({}));
  const email = (identifier || "").toLowerCase().trim();
  if (!email) return NextResponse.json({ exists: false });
  const user = await prisma.user
    .findUnique({ where: { email } })
    .catch(() => null);
  return NextResponse.json({ exists: Boolean(user) });
}
