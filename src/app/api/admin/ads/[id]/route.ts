import { dbConnect } from "@/lib/db";
import { AdCampaign, AdSlot } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  if (body.kind === "slot") {
    const item = await AdSlot.findByIdAndUpdate(id, body, { new: true });
    if (!item) return jsonError("Slot not found", 404);
    revalidatePath("/");
    return jsonOk({ item });
  }
  const item = await AdCampaign.findByIdAndUpdate(id, body, { new: true });
  if (!item) return jsonError("Campaign not found", 404);
  revalidatePath("/");
  return jsonOk({ item });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  await dbConnect();
  await AdCampaign.findByIdAndDelete(id);
  revalidatePath("/");
  return jsonOk({ ok: true });
}
