import { dbConnect } from "@/lib/db";
import { Page } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const items = await Page.find().sort({ title: 1 }).lean();
  return jsonOk({ items });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  if (!body.title) return jsonError("Title is required.");
  await dbConnect();
  const slug = slugify(body.slug || body.title);
  const item = await Page.create({
    ...body,
    slug,
    content: sanitizeArticleHtml(body.content || ""),
  });
  revalidatePath(`/${slug}`);
  return jsonOk({ item }, 201);
}
