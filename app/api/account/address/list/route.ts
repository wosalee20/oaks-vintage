import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;
  const addresses = email
    ? await prisma.address.findMany({
        where: { user: { email } },
        orderBy: { id: "desc" },
      })
    : [];
  return NextResponse.json({ addresses });
}
