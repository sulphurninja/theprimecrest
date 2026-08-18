import { dbConnect } from "@/lib/db";
import { Inquiry, Subscriber } from "@/models";
import { requireAdmin, jsonOk } from "@/lib/api";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const kind = new URL(request.url).searchParams.get("kind") || "inquiries";
  if (kind === "subscribers") {
    const items = await Subscriber.find().sort({ createdAt: -1 }).lean();
    return jsonOk({ items });
  }
  const items = await Inquiry.find().sort({ createdAt: -1 }).lean();
  return jsonOk({ items });
}
