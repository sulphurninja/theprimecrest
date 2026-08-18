import { dbConnect } from "@/lib/db";
import { Inquiry } from "@/models";
import { requireAdmin, jsonOk } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  const item = await Inquiry.findByIdAndUpdate(id, { status: body.status }, { new: true });
  return jsonOk({ item });
}
