import { dbConnect } from "@/lib/db";
import { serialize } from "@/lib/utils";
import {
  Article,
  Category,
  Homepage,
  Settings,
  AdCampaign,
  AdSlot,
  User,
  Page,
} from "@/models";
import type { ArticleDoc } from "@/models/Article";

/** An article after .populate() + serialize(): ids are strings, refs are objects. */
export type HydratedArticle = Omit<
  ArticleDoc,
  "category" | "author" | "publishedAt" | "scheduledAt"
> & {
  _id: string;
  publishedAt?: string | null;
  category?: { _id: string; name: string; slug: string; kicker?: string };
  author?: { _id: string; name: string; slug: string; title?: string; avatar?: string; bio?: string };
};

const articlePopulate = [
  { path: "author", select: "name slug title avatar bio socials" },
  { path: "category", select: "name slug kicker" },
];

export async function getSettings() {
  await dbConnect();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = (await Settings.create({})).toObject();
  }
  return serialize(settings);
}

export async function getPublishedArticle(slug: string) {
  await dbConnect();
  const article = await Article.findOne({ slug, status: "published" })
    .populate(articlePopulate)
    .lean();
  return article ? serialize(article) : null;
}

export async function getRelatedArticles(articleId: string, categoryId: string, limit = 4) {
  await dbConnect();
  const related = await Article.find({
    _id: { $ne: articleId },
    category: categoryId,
    status: "published",
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate(articlePopulate)
    .lean();
  return serialize(related);
}

export async function getCategoryBySlug(slug: string) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  return category ? serialize(category) : null;
}

export async function getCategoryArticles(categoryId: string, page = 1, limit = 12) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Article.find({ category: categoryId, status: "published" })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(articlePopulate)
      .lean(),
    Article.countDocuments({ category: categoryId, status: "published" }),
  ]);
  return { items: serialize(items), total };
}

export async function getAuthorBySlug(slug: string) {
  await dbConnect();
  const author = await User.findOne({ slug }).select("-passwordHash").lean();
  return author ? serialize(author) : null;
}

export async function getAuthorArticles(authorId: string) {
  await dbConnect();
  const items = await Article.find({ author: authorId, status: "published" })
    .sort({ publishedAt: -1 })
    .populate(articlePopulate)
    .lean();
  return serialize(items);
}

export async function getPageBySlug(slug: string) {
  await dbConnect();
  const page = await Page.findOne({ slug, published: true }).lean();
  return page ? serialize(page) : null;
}

export async function getNavCategories() {
  await dbConnect();
  const cats = await Category.find().sort({ order: 1, name: 1 }).lean();
  return serialize(cats);
}

export async function getActiveAd(slotKey: string) {
  await dbConnect();
  const slot = await AdSlot.findOne({ key: slotKey, enabled: true }).lean();
  if (!slot) return null;
  const now = new Date();
  const campaign = await AdCampaign.findOne({
    slotKey,
    active: true,
    $and: [
      { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
    ],
  })
    .sort({ priority: -1, createdAt: -1 })
    .lean();
  if (!campaign) {
    return serialize({ slot, campaign: null });
  }
  return serialize({ slot, campaign });
}

export async function searchArticles(q: string) {
  await dbConnect();
  const query = q.trim();
  if (!query) return [];
  const items = await Article.find({
    status: "published",
    $or: [
      { title: new RegExp(query, "i") },
      { dek: new RegExp(query, "i") },
      { excerpt: new RegExp(query, "i") },
      { tags: new RegExp(query, "i") },
    ],
  })
    .sort({ publishedAt: -1 })
    .limit(24)
    .populate(articlePopulate)
    .lean();
  return serialize(items);
}

export async function getTrendingArticles(limit = 5) {
  await dbConnect();
  const items = await Article.find({ status: "published" })
    .sort({ views: -1, publishedAt: -1 })
    .limit(limit)
    .populate(articlePopulate)
    .lean();
  return serialize<HydratedArticle[]>(items);
}

export async function getPopularTags(limit = 12) {
  await dbConnect();
  const result = await Article.aggregate([
    { $match: { status: "published" } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return result.map((r) => ({ tag: r._id as string, count: r.count as number }));
}

function asId(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "_id" in value) {
    return String((value as { _id: unknown })._id);
  }
  return String(value);
}

export async function getHomePayload() {
  await dbConnect();
  const [settings, homepage, categories] = await Promise.all([
    getSettings(),
    Homepage.findOne().lean(),
    Category.find().sort({ order: 1 }).lean(),
  ]);

  const published = await Article.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .populate(articlePopulate)
    .lean();

  const all = serialize<HydratedArticle[]>(published);
  const byId = new Map(all.map((a) => [String(a._id), a]));

  const pick = (id: unknown) => (id ? byId.get(String(id)) : undefined);
  const pickMany = (ids: unknown[] | undefined) =>
    (ids || []).map(pick).filter(Boolean);

  let hero = homepage ? pick(homepage.heroArticle) : undefined;
  if (!hero) hero = all.find((a) => a.isHero) || all[0];

  let featured = homepage ? pickMany(homepage.featuredArticles as unknown[]) : [];
  if (!featured.length) {
    featured = all.filter((a) => a.featured && String(a._id) !== asId(hero?._id)).slice(0, 4);
  }

  let cover = homepage ? pick(homepage.coverStory) : undefined;
  if (!cover) cover = all.find((a) => a.isCoverStory && String(a._id) !== asId(hero?._id));

  let briefing = homepage ? pickMany(homepage.briefingArticles as unknown[]) : [];
  if (!briefing.length) {
    const used = new Set([asId(hero?._id), ...featured.map((a) => asId(a?._id)), asId(cover?._id)]);
    briefing = all.filter((a) => !used.has(String(a._id))).slice(0, 5);
  }

  const interview =
    (homepage ? pick(homepage.interviewArticle) : undefined) ||
    all.find((a) => a.format === "interview");

  const usedIds = new Set(
    [hero, cover, interview, ...featured, ...briefing]
      .filter(Boolean)
      .map((a) => String(a!._id)),
  );

  const rails = (homepage?.categoryRails?.length
    ? homepage.categoryRails.map((id) => String(id))
    : categories.slice(0, 6).map((c) => String(c._id))
  )
    .map((id) => categories.find((c) => String(c._id) === id))
    .filter(Boolean)
    .map((cat) => ({
      category: serialize(cat),
      articles: all
        .filter(
          (a) =>
            String(a.category?._id || a.category) === String(cat!._id) &&
            !usedIds.has(String(a._id)),
        )
        .slice(0, 4),
    }));

  return {
    settings,
    hero: hero || null,
    featured,
    cover: cover || null,
    briefing,
    interview: interview || null,
    rails,
    categories: serialize(categories),
    latest: all.slice(0, 8),
    showAds: homepage?.showAds !== false,
    showNewsletter: homepage?.showNewsletter !== false,
    showAdvertiseBand: homepage?.showAdvertiseBand !== false,
  };
}
