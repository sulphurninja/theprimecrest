import { dbConnect } from "@/lib/db";
import { Category } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const items = await Category.find().sort({ order: 1, name: 1 }).lean();
  return jsonOk({ items });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  if (!body.name) return jsonError("Name is required.");
  await dbConnect();
  const slug = slugify(body.slug || body.name);
  const exists = await Category.findOne({ slug });
  if (exists) return jsonError("That slug is already in use.");
  const item = await Category.create({ ...body, slug });
  revalidatePath("/");
  return jsonOk({ item }, 201);
}
