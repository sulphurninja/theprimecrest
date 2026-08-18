import { dbConnect } from "@/lib/db";
import { Media } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { cloudinaryReady, destroyAsset } from "@/lib/cloudinary";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  const item = await Media.findByIdAndUpdate(
    id,
    {
      alt: body.alt,
      caption: body.caption,
      credit: body.credit,
    },
    { new: true },
  );
  if (!item) return jsonError("Asset not found", 404);
  return jsonOk({ item });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  await dbConnect();
  const item = await Media.findById(id);
  if (!item) return jsonError("Asset not found", 404);
  if (item.publicId && cloudinaryReady()) {
    await destroyAsset(item.publicId, item.resourceType || "image");
  }
  await item.deleteOne();
  return jsonOk({ ok: true });
}
