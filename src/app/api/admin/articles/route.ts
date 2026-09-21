import { dbConnect } from "@/lib/db";
import { Article } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { readingTime, slugify, excerptFromHtml } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";

function normalizeSections(body: Record<string, unknown>) {
  const raw = Array.isArray(body.categories) ? body.categories.map(String).filter(Boolean) : [];
  if (body.category) raw.unshift(String(body.category));
  const categories = [...new Set(raw)];
  if (!categories.length) return false;
  body.categories = categories;
  body.category = categories.includes(String(body.category)) ? body.category : categories[0];
  return true;
}

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) filter.title = new RegExp(q, "i");
  const items = await Article.find(filter)
    .sort({ updatedAt: -1 })
    .populate("author", "name")
    .populate("category", "name slug")
    .populate("categories", "name slug")
    .lean();
  return jsonOk({ items });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  if (!body.title || !body.author || !normalizeSections(body)) {
    return jsonError("Title, at least one section, and author are required.");
  }
  await dbConnect();
  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  const exists = await Article.findOne({ slug });
  if (exists) return jsonError("That slug is already in use.");
  const content = sanitizeArticleHtml(body.content || "");
  const article = await Article.create({
    ...body,
    slug,
    content,
    excerpt: body.excerpt || excerptFromHtml(content),
    readTime: readingTime(content),
    publishedAt: body.status === "published" ? body.publishedAt || new Date() : body.publishedAt,
  });
  revalidatePath("/");
  return jsonOk({ item: article }, 201);
}
