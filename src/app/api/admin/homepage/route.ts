import { dbConnect } from "@/lib/db";
import { Homepage, Article, Category } from "@/models";
import { requireAdmin, jsonOk } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { getMagazineIssues } from "@/lib/queries";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  let homepage = await Homepage.findOne().lean();
  if (!homepage) homepage = (await Homepage.create({})).toObject();
  const [articles, categories, issues] = await Promise.all([
    Article.find({ status: "published" }).sort({ publishedAt: -1 }).select("title slug format category categories").lean(),
    Category.find().sort({ order: 1 }).select("name slug").lean(),
    getMagazineIssues(),
  ]);
  // Magazine features in the order set in Admin -> Magazines.
  const issueSlugs = issues.map((issue) => issue.articleSlug);
  return jsonOk({ homepage, articles, categories, issueSlugs });
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  await dbConnect();
  const homepage = await Homepage.findOneAndUpdate({}, body, { new: true, upsert: true });
  revalidatePath("/", "layout");
  return jsonOk({ homepage });
}
