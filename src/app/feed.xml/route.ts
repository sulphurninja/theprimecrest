import { dbConnect } from "@/lib/db";
import { Article } from "@/models";
import { SITE } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

export const revalidate = 300;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  let items = "";
  try {
    await dbConnect();
    const articles = await Article.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .limit(30)
      .populate("author", "name")
      .populate("category", "name")
      .lean();

    items = articles
      .map((a) => {
        const url = siteUrl(`/story/${a.slug}`);
        const author = (a.author as { name?: string } | null)?.name || SITE.name;
        const category = (a.category as { name?: string } | null)?.name || "";
        return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.excerpt || a.dek || "")}</description>
      <author>${escapeXml(author)}</author>
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
      <pubDate>${a.publishedAt ? new Date(a.publishedAt).toUTCString() : ""}</pubDate>
    </item>`;
      })
      .join("\n");
  } catch {
    items = "";
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${siteUrl()}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${siteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
