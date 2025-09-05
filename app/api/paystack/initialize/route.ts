import { NextResponse } from "next/server";
import { paystackInit } from "@/lib/paystack";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId, email, amountNaira } = await req.json();
  if (!orderId || !email || !amountNaira)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const reference = `OV-${orderId}-${Date.now()}`;

  // create a Payment row in INITIATED
  await prisma.payment.create({
    data: {
      orderId,
      reference,
      amountKobo: Math.round(Number(amountNaira) * 100),
      currency: "NGN",
    },
  });

  const data = await paystackInit(
    Number(amountNaira),
    email,
    reference,
    `${process.env.NEXTAUTH_URL}/checkout/verify`
  );
  return NextResponse.json({
    ok: true,
    reference,
    authUrl: data?.data?.authorization_url,
  });
}
