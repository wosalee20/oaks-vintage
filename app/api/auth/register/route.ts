import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const exists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (exists)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email: email.toLowerCase(), passwordHash: hash },
  });
  return NextResponse.json({ ok: true });
}
