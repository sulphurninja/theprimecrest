import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Inquiry } from "@/models";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    await Inquiry.create({
      type: "contact",
      name,
      email,
      message: subject ? `[${subject}] ${message}` : message,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
