import { dbConnect } from "@/lib/db";
import { Inquiry } from "@/models";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return jsonError("Name, email, and a message are required.");
  }
  await dbConnect();
  await Inquiry.create({
    type: body.type || "contact",
    name: body.name,
    email: String(body.email).toLowerCase().trim(),
    company: body.company || "",
    budget: body.budget || "",
    message: body.message,
  });
  return jsonOk({ ok: true });
}
