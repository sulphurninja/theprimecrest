/**
 * Live headlines for The Wire, fetched server-side so the API key never
 * reaches the browser. Works with NewsAPI.org or GNews.io, picked by
 * NEWS_API_PROVIDER. Responses are cached for NEWS_REVALIDATE seconds, so
 * traffic doesn't burn through the provider's daily request quota. GNews is
 * the default.
 * Without a key, or if the provider fails, this returns [] and the news
 * sections hide themselves.
 */

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
};

export const NEWS_TOPICS = [
  { slug: "business", label: "Business" },
  { slug: "technology", label: "Technology" },
  { slug: "general", label: "World" },
  { slug: "science", label: "Science" },
  { slug: "health", label: "Health" },
] as const;

export type NewsTopic = (typeof NEWS_TOPICS)[number]["slug"];

type Provider = "newsapi" | "gnews";

const PROVIDER_LABEL: Record<Provider, { name: string; url: string }> = {
  newsapi: { name: "NewsAPI.org", url: "https://newsapi.org" },
  gnews: { name: "GNews", url: "https://gnews.io" },
};

function config() {
  const provider: Provider = process.env.NEWS_API_PROVIDER === "newsapi" ? "newsapi" : "gnews";
  return {
    provider,
    key: process.env.NEWS_API_KEY?.trim() || "",
    country: process.env.NEWS_API_COUNTRY?.trim().toLowerCase() || "us",
    revalidate: Math.max(300, Number(process.env.NEWS_REVALIDATE) || 1800),
  };
}

export function newsEnabled() {
  return Boolean(config().key);
}

export function newsCredit() {
  return PROVIDER_LABEL[config().provider];
}

export function isNewsTopic(value: string | undefined): value is NewsTopic {
  return NEWS_TOPICS.some((topic) => topic.slug === value);
}

function requestFor(topic: NewsTopic): { url: string; headers: Record<string, string> } {
  const { provider, key, country } = config();
  if (provider === "gnews") {
    const params = new URLSearchParams({
      category: topic === "general" ? "world" : topic,
      lang: "en",
      max: "25",
      apikey: key,
    });
    if (topic !== "general") params.set("country", country);
    return { url: `https://gnews.io/api/v4/top-headlines?${params}`, headers: {} };
  }
  const params = new URLSearchParams({ category: topic, country, pageSize: "40" });
  return {
    url: `https://newsapi.org/v2/top-headlines?${params}`,
    headers: { "X-Api-Key": key },
  };
}

type RawArticle = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  source?: { name?: string | null } | null;
};

/** NewsAPI suffixes titles with " - Source Name"; the source is shown separately. */
function cleanTitle(title: string, source: string) {
  const suffix = ` - ${source}`;
  return source && title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title.trim();
}

function normalize(raw: RawArticle[]): NewsItem[] {
  const seen = new Set<string>();
  const items: NewsItem[] = [];
  for (const article of raw) {
    const source = article.source?.name?.trim() || "";
    const title = article.title ? cleanTitle(article.title, source) : "";
    const url = article.url?.trim() || "";
    if (!title || !url.startsWith("http") || title === "[Removed]") continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const image = (article.urlToImage || article.image || "").trim();
    items.push({
      id: url,
      title,
      description: (article.description || "").replace(/<[^>]+>/g, "").trim(),
      url,
      image: image.startsWith("https://") ? image : "",
      source,
      publishedAt: article.publishedAt || "",
    });
  }
  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getNews(topic: NewsTopic = "business", limit = 24): Promise<NewsItem[]> {
  const { key, revalidate } = config();
  if (!key) return [];
  try {
    const { url, headers } = requestFor(topic);
    const res = await fetch(url, {
      headers: { "User-Agent": "PrimeCrest/1.0", ...headers },
      next: { revalidate, tags: ["news", `news:${topic}`] },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: RawArticle[] };
    return normalize(data.articles || []).slice(0, limit);
  } catch {
    return [];
  }
}
