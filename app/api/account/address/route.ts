import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fullName, line1, line2, city, state, country, phone } =
    await req.json();
  await prisma.address.create({
    data: {
      user: { connect: { email: session.user.email } },
      fullName,
      line1,
      line2,
      city,
      state,
      country,
      phone,
    },
  });
  return NextResponse.json({ ok: true });
}
