import { dbConnect } from "@/lib/db";
import { Settings } from "@/models";
import { requireAdmin, jsonOk } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  let settings = await Settings.findOne().lean();
  if (!settings) settings = (await Settings.create({})).toObject();
  return jsonOk({ settings });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  await dbConnect();
  const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true });
  revalidatePath("/");
  return jsonOk({ settings });
}
