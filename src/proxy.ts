import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";

const LOGIN = "/admin/login";

export async function proxy(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (url.pathname === LOGIN || url.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN, url.origin));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(decodeURIComponent(token), secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(LOGIN, url.origin));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
