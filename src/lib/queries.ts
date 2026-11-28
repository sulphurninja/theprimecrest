import { dbConnect } from "@/lib/db";
import { demoAdsEnabled, demoCampaign, demoReplaces } from "@/lib/demo-ads";
import { AD_SLOTS } from "@/lib/constants";
import { cache } from "react";
import { MAGAZINE_ISSUES, issueRank, type MagazineIssue } from "@/lib/magazines";
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
  categories?: { _id: string; name: string; slug: string; kicker?: string }[];
  author?: { _id: string; name: string; slug: string; title?: string; avatar?: string; bio?: string };
};

const articlePopulate = [
  { path: "author", select: "name slug title avatar bio socials" },
  { path: "category", select: "name slug kicker" },
  { path: "categories", select: "name slug kicker" },
];

type CatRef = { _id?: string } | string | null | undefined;

/** Primary section plus any additional sections an article is filed under. */
export function articleSectionIds(article: { category?: CatRef; categories?: CatRef[] }) {
  const ids = new Set<string>();
  const add = (value: CatRef) => {
    if (!value) return;
    ids.add(typeof value === "string" ? value : String(value._id));
  };
  add(article.category);
  for (const section of article.categories || []) add(section);
  return ids;
}

function inSection(categoryId: string) {
  return { $or: [{ category: categoryId }, { categories: categoryId }] };
}

type IssueArticle = {
  slug: string;
  title: string;
  dek?: string;
  publishedAt?: string;
  coverImage?: string;
  magazineCover?: string;
  magazineUrl?: string;
  magazineIssue?: string;
  magazineRole?: string;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "INDIA'S TOP AESTHETIC DOCTOR" -> "India's top aesthetic doctor"; mixed case is left alone. */
function coverLine(text: string) {
  const t = text.trim();
  if (!t || t !== t.toUpperCase()) return t;
  const lower = t.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** An admin-marked magazine article, shaped like a hand-written issue. */
function issueFromArticle(a: IssueArticle): MagazineIssue {
  const [name, ...rest] = a.title.split(":");
  const month = a.publishedAt ? MONTHS[new Date(a.publishedAt).getUTCMonth()] : "";
  return {
    slug: a.slug,
    articleSlug: a.slug,
    name: name.trim(),
    role: a.magazineRole || "",
    volume: "",
    issue: a.magazineIssue || (month ? `The ${month} Issue` : "The Digital Issue"),
    title: coverLine(rest.join(":")) || a.dek || "",
    cover: a.magazineCover || a.coverImage || "",
    magazineUrl: a.magazineUrl || "",
    publishedAt: a.publishedAt,
  };
}

/** Months since year 0 for an issue's edition, e.g. "The November Issue" of 2026. */
function editionKey(issue: MagazineIssue) {
  const published = issue.publishedAt ? new Date(issue.publishedAt) : null;
  const year = published ? published.getUTCFullYear() : 0;
  const named = MONTHS.findIndex((month) => issue.issue.includes(month));
  const month = named >= 0 ? named : published ? published.getUTCMonth() : 0;
  return year * 12 + month;
}

/**
 * Latest edition first. Within a month, hand-written issues keep their volume
 * order (several shared a publish date) and other issues go newest first.
 */
function latestIssueFirst(a: MagazineIssue, b: MagazineIssue) {
  const byEdition = editionKey(b) - editionKey(a);
  if (byEdition) return byEdition;
  const ra = issueRank(a.articleSlug);
  const rb = issueRank(b.articleSlug);
  if (ra !== -1 && rb !== -1) return rb - ra;
  return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
}

/**
 * Every published magazine issue, in display order: the hand-written issues
 * in lib/magazines plus any article an editor marks "Digital magazine" with a
 * cover in the admin. Hand-written issues keep their own details.
 *
 * The order is the one saved in Admin -> Magazines (the first issue is the
 * featured one). Issues published since it was saved go first, newest first,
 * until an editor places them; with no saved order, everything is newest first.
 */
export const getMagazineIssues = cache(async (): Promise<MagazineIssue[]> => {
  const legacy = new Map(MAGAZINE_ISSUES.map((issue) => [issue.articleSlug, issue]));
  try {
    await dbConnect();
    const docs = await Article.find({
      status: "published",
      $or: [
        { magazineEnabled: true, magazineCover: { $nin: ["", null] } },
        { slug: { $in: [...legacy.keys()] } },
      ],
    })
      .select("slug title dek publishedAt coverImage magazineCover magazineUrl magazineIssue magazineRole")
      .lean();
    const issues = serialize<IssueArticle[]>(docs)
      .map((doc) => {
        const known = legacy.get(doc.slug);
        return known ? { ...known, publishedAt: doc.publishedAt } : issueFromArticle(doc);
      })
      .sort(latestIssueFirst);
    const saved = (await Homepage.findOne().select("magazineOrder").lean())?.magazineOrder ?? [];
    const position = new Map(saved.map((slug, index) => [slug, index]));
    const unplaced = issues.filter((issue) => !position.has(issue.articleSlug));
    const placed = issues
      .filter((issue) => position.has(issue.articleSlug))
      .sort((a, b) => position.get(a.articleSlug)! - position.get(b.articleSlug)!);
    return [...unplaced, ...placed];
  } catch {
    return [...MAGAZINE_ISSUES].reverse();
  }
});

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
    status: "published",
    ...inSection(categoryId),
  })
    .sort({ publishedAt: -1, _id: -1 })
    .limit(limit)
    .populate(articlePopulate)
    .lean();
  return serialize(related);
}

export async function getSectionMagazines(slug: string) {
  await dbConnect();
  const category = await Category.findOne({ slug }).select("magazines").lean();
  if (!category) return [];
  const ids = (category.magazines || []).map(String);
  // Hand-picked issues (Admin -> Categories) plus every magazine story filed in
  // this section, so ticking the section on a magazine story is enough.
  const items = await Article.find({
    status: "published",
    $or: [
      { _id: { $in: ids } },
      { magazineEnabled: true, magazineCover: { $nin: ["", null] }, categories: category._id },
    ],
  })
    .select("title slug magazineCover ogImage coverImage magazineEnabled publishedAt")
    .lean();
  // Same order as everywhere else (Admin -> Magazines); anything else after, newest first.
  const position = new Map((await getMagazineIssues()).map((issue, index) => [issue.articleSlug, index]));
  return serialize<Dated[]>(items).sort((a, b) => {
    const pa = position.get(a.slug ?? "");
    const pb = position.get(b.slug ?? "");
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    return newestFirst(a, b);
  });
}

type Dated = { slug?: string; publishedAt?: string | Date | null };

/**
 * Newest first. Magazine features sort by issue number, since several
 * issues can share a publish date; everything else by publish date.
 */
export function newestFirst(a: Dated, b: Dated) {
  const ra = a.slug ? issueRank(a.slug) : -1;
  const rb = b.slug ? issueRank(b.slug) : -1;
  if (ra !== -1 && rb !== -1) return rb - ra;
  return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
}

export async function getCategoryBySlug(slug: string) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  return category ? serialize(category) : null;
}

export async function getCategoryArticles(
  categoryId: string,
  page = 1,
  limit = 12,
  /** Stories shown elsewhere on the page (the cover shelf), left out of the list. */
  excludeIds: string[] = [],
) {
  await dbConnect();
  const skip = (page - 1) * limit;
  const filter = {
    status: "published" as const,
    ...inSection(categoryId),
    ...(excludeIds.length ? { _id: { $nin: excludeIds } } : {}),
  };
  const [items, total] = await Promise.all([
    Article.find(filter)
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate(articlePopulate)
      .lean(),
    Article.countDocuments(filter),
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
    .sort({ publishedAt: -1, _id: -1 })
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
  const stored = await AdSlot.findOne({ key: slotKey, enabled: true }).lean();
  // Demo mode also fills slots that were never created in the admin.
  const slot = stored || (demoAdsEnabled() ? AD_SLOTS.find((s) => s.key === slotKey) : null);
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
  // Local demo mode swaps campaigns for mock creatives (see lib/demo-ads).
  if (demoAdsEnabled() && demoReplaces(slotKey, campaign)) {
    const demo = demoCampaign(slotKey, { width: slot.width ?? 728, height: slot.height ?? 90 });
    if (demo) return serialize({ slot, campaign: demo });
  }
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
    .sort({ publishedAt: -1, _id: -1 })
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
    .sort({ publishedAt: -1, _id: -1 })
    .populate(articlePopulate)
    .lean();

  const all = serialize<HydratedArticle[]>(published);
  const byId = new Map(all.map((a) => [String(a._id), a]));

  const pick = (id: unknown) => (id ? byId.get(String(id)) : undefined);
  const pickMany = (ids: unknown[] | undefined) =>
    (ids || []).map(pick).filter((a): a is HydratedArticle => Boolean(a));

  // Hero carousel is the published magazine features, newest issue first.
  const issues = await getMagazineIssues();
  const bySlug = new Map(all.map((a) => [a.slug, a]));
  let heroArticles = issues.map((issue) => bySlug.get(issue.articleSlug)).filter(
    (a): a is HydratedArticle => Boolean(a),
  );
  if (heroArticles.length === 0) {
    heroArticles = all.slice(0, 5);
  }
  const hero = heroArticles[0];

  const mustReadPicks = homepage ? pickMany(homepage.featuredArticles as unknown[]) : [];
  let featured = mustReadPicks;
  if (!featured.length) {
    featured = all.filter((a) => a.featured && String(a._id) !== asId(hero?._id)).slice(0, 4);
  }

  let cover = homepage ? pick(homepage.coverStory) : undefined;
  if (!cover) cover = all.find((a) => a.isCoverStory && String(a._id) !== asId(hero?._id));

  const briefingPicks = homepage ? pickMany(homepage.briefingArticles as unknown[]) : [];
  let briefing = briefingPicks;
  if (!briefing.length) {
    const used = new Set([asId(hero?._id), ...featured.map((a) => asId(a?._id)), asId(cover?._id)]);
    briefing = all.filter((a) => !used.has(String(a._id))).slice(0, 5);
  }

  const interview =
    (homepage ? pick(homepage.interviewArticle) : undefined) ||
    all.find((a) => a.format === "interview");

  const usedIds = new Set(
    [hero, cover, ...featured, ...briefing]
      .filter(Boolean)
      .map((a) => String(a!._id)),
  );

  const magazineSlugs = new Set(issues.map((issue) => issue.articleSlug));

  const railPicks = (homepage?.railArticles ?? {}) as unknown as Record<string, unknown[]>;
  const rails = (homepage?.categoryRails?.length
    ? homepage.categoryRails.map((id) => String(id))
    : categories.slice(0, 6).map((c) => String(c._id))
  )
    .map((id) => categories.find((c) => String(c._id) === id))
    .filter(Boolean)
    .map((cat) => {
      const pinned = pickMany(railPicks[String(cat!._id)]);
      const pinnedIds = new Set(pinned.map((a) => String(a!._id)));
      const automatic = all.filter(
        (a) =>
          articleSectionIds(a).has(String(cat!._id)) &&
          !usedIds.has(String(a._id)) &&
          !pinnedIds.has(String(a._id)) &&
          !magazineSlugs.has(a.slug),
      );
      return { category: serialize(cat), articles: [...pinned, ...automatic].slice(0, 4) };
    });

  // More from PrimeCrest: pinned stories first, then the newest not shown above.
  const morePicks = homepage ? pickMany(homepage.moreArticles as unknown[]) : [];
  const moreIds = new Set(morePicks.map((a) => String(a!._id)));
  const more = [
    ...morePicks,
    ...all.filter(
      (a) => !magazineSlugs.has(a.slug) && !usedIds.has(String(a._id)) && !moreIds.has(String(a._id)),
    ),
  ].slice(0, 4);

  return {
    settings,
    hero: hero || null,
    heroArticles,
    featured,
    cover: cover || null,
    briefing,
    interview: interview || null,
    rails,
    categories: serialize(categories),
    latest: all.slice(0, 8),
    more,
    mustReadPicks,
    briefingPicks,
    leaderPicks: homepage ? pickMany(homepage.leaderArticles as unknown[]).map((a) => a.slug) : [],
    showAds: homepage?.showAds !== false,
    showNewsletter: homepage?.showNewsletter !== false,
    showAdvertiseBand: homepage?.showAdvertiseBand !== false,
  };
}
