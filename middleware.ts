import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token as any)?.role;

  // Guard admin area
  if (pathname.startsWith("/admin")) {
    if (role === "ADMIN") return NextResponse.next();
    const signin = req.nextUrl.clone();
    signin.pathname = "/api/auth/signin";
    signin.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signin);
  }

  // If an ADMIN hits /account, send them to /admin
  if (pathname === "/account" && role === "ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/account"] };
