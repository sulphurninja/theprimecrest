import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { destroyAsset } from "@/lib/cloudinary";
import { RESERVED_FOLIO_SLUGS, flipbookUrl, folioMagazines, type FlipbookPage } from "@/lib/folio";
import { slugify } from "@/lib/utils";

/** The flipbook already built for a story, if any. */
export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const slug = slugify(new URL(request.url).searchParams.get("slug") || "");
  if (!slug) return jsonOk({ flipbook: null });
  const Magazine = await folioMagazines();
  const mag = await Magazine.findOne({ slug }).select("slug pages updatedAt").lean();
  return jsonOk({
    flipbook: mag ? { url: flipbookUrl(slug), pages: mag.pages?.length || 0, updatedAt: mag.updatedAt } : null,
  });
}

/**
 * Publish (or replace) the flipbook for a story from its uploaded page images.
 * Body: { slug, title, issueLabel?, description?, pages: FlipbookPage[] }
 */
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    issueLabel?: string;
    description?: string;
    pages?: FlipbookPage[];
  };
  const slug = slugify(body.slug || "");
  const pages = (body.pages || []).filter((p) => p && typeof p.url === "string" && p.url.startsWith("https://"));
  if (!slug || !body.title) return jsonError("The story needs a title and slug first.");
  if (RESERVED_FOLIO_SLUGS.has(slug)) return jsonError(`"${slug}" is a hand-built issue. Use a different story slug.`);
  if (!pages.length) return jsonError("No pages were uploaded.");

  const Magazine = await folioMagazines();
  const previous = await Magazine.findOne({ slug }).select("kind pages").lean();
  if (previous?.kind === "html") return jsonError(`"${slug}" is a hand-built issue in folio.`);

  await Magazine.findOneAndUpdate(
    { slug },
    {
      $set: {
        title: body.title,
        slug,
        issueLabel: body.issueLabel || "",
        description: body.description || "",
        kind: "images",
        pages,
        coverImage: pages[0].url,
        ogImage: pages[0].url,
        published: true,
      },
      $setOnInsert: { publishedAt: new Date(), views: 0 },
    },
    { upsert: true },
  );

  // Clear out the page images of the edition this one replaced.
  const kept = new Set(pages.map((p) => p.publicId));
  const stale = (previous?.pages || []).map((p) => p.publicId).filter((id) => id && !kept.has(id));
  await Promise.allSettled(stale.map((id) => destroyAsset(id)));

  return jsonOk({ url: flipbookUrl(slug), cover: pages[0].url, pages: pages.length });
}
