import { dbConnect } from "@/lib/db";
import { Subscriber } from "@/models";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email || "")
    .toLowerCase()
    .trim();
  if (!email || !email.includes("@")) return jsonError("A valid email is required.");
  await dbConnect();
  await Subscriber.findOneAndUpdate(
    { email },
    { email, name: body?.name || "", status: "active" },
    { upsert: true, new: true },
  );
  return jsonOk({ ok: true });
}
