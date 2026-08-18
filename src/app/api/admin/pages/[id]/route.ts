import { dbConnect } from "@/lib/db";
import { Page } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  if (body.title || body.slug) body.slug = slugify(body.slug || body.title);
  if (typeof body.content === "string") body.content = sanitizeArticleHtml(body.content);
  const item = await Page.findByIdAndUpdate(id, body, { new: true });
  if (!item) return jsonError("Page not found", 404);
  revalidatePath(`/${item.slug}`);
  return jsonOk({ item });
}
