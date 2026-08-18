import { dbConnect } from "@/lib/db";
import { Article } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { readingTime, slugify, excerptFromHtml } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  await dbConnect();
  const item = await Article.findById(id)
    .populate("author", "name slug")
    .populate("category", "name slug")
    .lean();
  if (!item) return jsonError("Article not found", 404);
  return jsonOk({ item });
}

export async function PUT(request: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await request.json();
  await dbConnect();
  const current = await Article.findById(id);
  if (!current) return jsonError("Article not found", 404);

  if (body.slug || body.title) {
    const slug = slugify(body.slug || body.title || current.title);
    const clash = await Article.findOne({ slug, _id: { $ne: id } });
    if (clash) return jsonError("That slug is already in use.");
    body.slug = slug;
  }
  if (typeof body.content === "string") {
    body.content = sanitizeArticleHtml(body.content);
    body.readTime = readingTime(body.content);
    if (!body.excerpt) body.excerpt = excerptFromHtml(body.content);
  }
  if (body.status === "published" && !current.publishedAt && !body.publishedAt) {
    body.publishedAt = new Date();
  }

  const item = await Article.findByIdAndUpdate(id, body, { new: true });
  revalidatePath("/");
  revalidatePath(`/story/${item?.slug}`);
  return jsonOk({ item });
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  await dbConnect();
  await Article.findByIdAndDelete(id);
  revalidatePath("/");
  return jsonOk({ ok: true });
}
