import { dbConnect } from "@/lib/db";
import { AdSlot, AdCampaign } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const [slots, campaigns] = await Promise.all([
    AdSlot.find().sort({ name: 1 }).lean(),
    AdCampaign.find().sort({ createdAt: -1 }).lean(),
  ]);
  return jsonOk({ slots, campaigns });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  if (!body.name || !body.slotKey) return jsonError("Name and slot are required.");
  await dbConnect();
  const item = await AdCampaign.create(body);
  revalidatePath("/");
  return jsonOk({ item }, 201);
}
