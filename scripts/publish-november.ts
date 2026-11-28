/**
 * Upserts the November issue features (Bhatia, Erica, Jon Eric, Liutciia, Verna).
 *
 * Copy lives in scripts/november/<slug>.json; the cover (magcover.jpg, exported
 * from the folio issue) and the 2:1 story photo (wide.jpg) live in
 * public/issues/<slug>/ and are uploaded to Cloudinary so the story works
 * before the next deploy.
 *
 * Run: node --env-file=.env.local --import tsx scripts/publish-november.ts [--draft] [--refresh-covers]
 * --refresh-covers re-uploads magcover.jpg after a cover is re-exported.
 * --only <slug> touches one issue and leaves the others (and any admin edits) alone.
 */
import { readFileSync } from "fs";
import path from "path";
import { dbConnect } from "../src/lib/db";
import { uploadBuffer } from "../src/lib/cloudinary";
import { User, Category, Article } from "../src/models";
import { readingTime } from "../src/lib/utils";

const MAGAZINE_DOMAIN = "https://magazines.theprimecrest.com";
// Run from the repo root.
const ROOT = process.cwd();

/** Volume numbers set the order: the higher volume is the newer issue. */
const ISSUES = [
  { slug: "bhatia", vol: 9, women: true },
  { slug: "erica", vol: 10, women: true },
  { slug: "joneric", vol: 12, women: false },
  { slug: "liutciia", vol: 13, women: true },
  { slug: "verna", vol: 15, women: true },
];

type Copy = {
  name: string;
  role: string;
  title: string;
  articleSlug: string;
  dek: string;
  excerpt: string;
  seoDescription: string;
  content: string;
  pullQuote: { text: string; attribution: string };
  tags: string[];
  caption: string;
};

async function upload(slug: string, file: string) {
  const buffer = readFileSync(path.join(ROOT, "public", "issues", slug, file));
  const result = await uploadBuffer(buffer, `${slug}-${file}`, "image/jpeg");
  return result.secure_url;
}

async function main() {
  const draft = process.argv.includes("--draft");
  const refreshCovers = process.argv.includes("--refresh-covers");
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : null;
  await dbConnect();
  const [magazine, affairs, women, home, author] = await Promise.all([
    Category.findOne({ slug: "magazine" }),
    Category.findOne({ slug: "affairs" }),
    Category.findOne({ slug: "women-in-business" }),
    Category.findOne({ slug: "home" }),
    User.findOne({ role: "admin" }).then((user) => user || User.findOne()),
  ]);
  if (!magazine || !affairs || !author) throw new Error("Missing magazine/affairs category or author");

  const now = Date.now();
  for (const issue of ISSUES.filter((item) => !only || item.slug === only)) {
    const copy = JSON.parse(
      readFileSync(path.join(ROOT, "scripts", "november", `${issue.slug}.json`), "utf8"),
    ) as Copy;
    const existing = await Article.findOne({ slug: copy.articleSlug }).lean();

    const cover =
      existing?.magazineCover && !refreshCovers ? existing.magazineCover : await upload(issue.slug, "magcover.jpg");
    const wide = existing?.coverImage || (await upload(issue.slug, "wide.jpg"));

    const categories = [affairs._id, magazine._id, issue.women ? women?._id : null, home?._id].filter(
      Boolean,
    );

    const article = await Article.findOneAndUpdate(
      { slug: copy.articleSlug },
      {
        $set: {
          title: copy.title,
          slug: copy.articleSlug,
          dek: copy.dek,
          excerpt: copy.excerpt,
          content: copy.content,
          coverImage: wide,
          coverCaption: copy.caption,
          ogImage: cover,
          magazineCover: cover,
          magazineEnabled: true,
          magazineUrl: `${MAGAZINE_DOMAIN}/m/${issue.slug}`,
          magazineIssue: "The November Issue",
          magazineRole: copy.role,
          category: affairs._id,
          categories,
          tags: copy.tags,
          author: author._id,
          status: draft ? "draft" : "published",
          format: "feature",
          allowAds: true,
          seoDescription: copy.seoDescription,
          readTime: readingTime(copy.content),
          pullQuote: copy.pullQuote,
          // Newest volume first: Vol. XV is a minute newer than Vol. XIII, and so on.
          publishedAt: existing?.publishedAt ?? new Date(now - (15 - issue.vol) * 60_000),
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    console.log(draft ? "draft" : "published", article?.slug, "->", `/story/${article?.slug}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
