import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // ensure Node runtime for crypto
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";
  const computed = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
    .update(raw)
    .digest("hex");
  if (computed !== signature)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const evt = JSON.parse(raw);
  if (evt?.event === "charge.success") {
    const ref = evt?.data?.reference as string;
    const amountKobo = evt?.data?.amount as number;

    const payment = await prisma.payment.update({
      where: { reference: ref },
      data: { status: "SUCCESS", amountKobo, raw: evt },
      include: { order: true },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });
  }

  return NextResponse.json({ received: true });
}
