import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { signToken, verifyPassword, sessionCookieOptions } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "")
    .toLowerCase()
    .trim();
  const password = String(body?.password || "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Those credentials were not recognised." }, { status: 401 });
  }

  const token = await signToken({
    sub: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({
    ok: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
