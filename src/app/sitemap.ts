import type { MetadataRoute } from "next";
import { dbConnect } from "@/lib/db";
import { Article, Category, Page } from "@/models";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: siteUrl("/advertise"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/newsletter"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/contact"), changeFrequency: "yearly", priority: 0.4 },
  ];

  try {
    await dbConnect();
    const [articles, categories, pages] = await Promise.all([
      Article.find({ status: "published" }).select("slug updatedAt").lean(),
      Category.find().select("slug updatedAt").lean(),
      Page.find({ published: true }).select("slug updatedAt").lean(),
    ]);

    return [
      ...staticEntries,
      ...categories.map((c) => ({
        url: siteUrl(`/c/${c.slug}`),
        lastModified: c.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...articles.map((a) => ({
        url: siteUrl(`/story/${a.slug}`),
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...pages.map((p) => ({
        url: siteUrl(`/${p.slug}`),
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.3,
      })),
    ];
  } catch {
    return staticEntries;
  }
}
