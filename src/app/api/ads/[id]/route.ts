import { dbConnect } from "@/lib/db";
import { AdCampaign } from "@/models";
import { jsonError, jsonOk } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  await dbConnect();
  const field = body.kind === "click" ? "clicks" : "impressions";
  const item = await AdCampaign.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { new: true });
  if (!item) return jsonError("Not found", 404);
  return jsonOk({ ok: true });
}
