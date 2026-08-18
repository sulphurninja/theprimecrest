import { dbConnect } from "@/lib/db";
import { Homepage, Article, Category } from "@/models";
import { requireAdmin, jsonOk } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  let homepage = await Homepage.findOne().lean();
  if (!homepage) homepage = (await Homepage.create({})).toObject();
  const [articles, categories] = await Promise.all([
    Article.find({ status: "published" }).sort({ publishedAt: -1 }).select("title slug format").lean(),
    Category.find().sort({ order: 1 }).select("name slug").lean(),
  ]);
  return jsonOk({ homepage, articles, categories });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  await dbConnect();
  const homepage = await Homepage.findOneAndUpdate({}, body, { new: true, upsert: true });
  revalidatePath("/");
  return jsonOk({ homepage });
}
