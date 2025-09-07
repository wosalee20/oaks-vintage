import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, phone } = await req.json();
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name, phone },
  });
  return NextResponse.json({ ok: true });
}
