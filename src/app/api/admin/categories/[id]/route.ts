import { dbConnect } from "@/lib/db";
import { Category } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  if (body.name || body.slug) body.slug = slugify(body.slug || body.name);
  const item = await Category.findByIdAndUpdate(id, body, { new: true });
  if (!item) return jsonError("Category not found", 404);
  revalidatePath("/");
  return jsonOk({ item });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  await dbConnect();
  await Category.findByIdAndDelete(id);
  revalidatePath("/");
  return jsonOk({ ok: true });
}
