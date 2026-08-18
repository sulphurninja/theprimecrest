import { Suspense } from "react";
import Link from "next/link";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { SearchForm } from "@/components/site/SearchForm";
import {
  searchArticles,
  getTrendingArticles,
  getPopularTags,
  getNavCategories,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { TrendingUp, Tag, Layers, Search, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search the PrimeCrest archive of reporting, features, and analysis.",
  path: "/search",
  noIndex: true,
});

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const [results, trending, tags, categories] = await Promise.all([
    q ? searchArticles(q).catch(() => []) : Promise.resolve([]),
    getTrendingArticles(5),
    getPopularTags(10),
    getNavCategories(),
  ]);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper-2">
          <Search className="h-5 w-5 text-ink" />
        </div>
        <h1 className="headline text-[2rem] sm:text-[2.6rem]">Explore the Archive</h1>
        <p className="mx-auto mt-3 max-w-md font-serif text-ink-soft">
          Search across every story we&apos;ve published — reporting, interviews, essays, and
          analysis.
        </p>
      </div>

      {/* Search Form */}
      <div className="mx-auto max-w-[600px]">
        <Suspense>
          <SearchForm />
        </Suspense>
      </div>

      {q ? (
        /* Search Results */
        <div className="mt-12">
          <div className="flex items-center justify-between border-b border-rule pb-4">
            <p className="meta">
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
            </p>
            {results.length > 0 && (
              <Link
                href="/search"
                className="font-sans text-[0.8rem] font-medium text-accent no-underline hover:underline"
              >
                Clear search
              </Link>
            )}
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-rule">
              {(results as CardArticle[]).map((article, i) => (
                <div
                  key={article._id}
                  className="py-8 animate-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <ArticleCard article={article} variant="standard" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-paper-2">
                <Search className="h-6 w-6 text-muted" />
              </div>
              <p className="headline text-[1.4rem]">No stories found</p>
              <p className="mt-2 font-serif text-ink-soft">
                Try a broader phrase, a name, or browse by section below.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Discovery View */
        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Trending Stories */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h2 className="section-title">Trending Now</h2>
            </div>
            <div className="divide-y divide-rule rounded-lg border border-rule bg-paper">
              {(trending as CardArticle[]).map((article, i) => (
                <Link
                  key={article._id}
                  href={`/story/${article.slug}`}
                  className="group flex items-start gap-4 p-5 no-underline transition-colors hover:bg-paper-2"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-2 font-sans text-[0.8rem] font-bold text-muted transition-colors group-hover:bg-ink group-hover:text-paper">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="kicker mb-1">{article.category?.name}</p>
                    <h3 className="headline text-[1.05rem] leading-tight transition-colors group-hover:text-accent">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Browse Sections */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent" />
                <h2 className="section-title">Browse Sections</h2>
              </div>
              <div className="space-y-1">
                {categories.map((cat: { _id: string; name: string; slug: string }) => (
                  <Link
                    key={cat._id}
                    href={`/c/${cat.slug}`}
                    className="group flex items-center justify-between rounded-md px-3 py-2.5 font-sans text-[0.9rem] font-medium text-ink no-underline transition-all hover:bg-paper-2"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                <h2 className="section-title">Popular Topics</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t: { tag: string; count: number }) => (
                  <Link
                    key={t.tag}
                    href={`/search?q=${encodeURIComponent(t.tag)}`}
                    className="rounded-full border border-rule bg-paper px-3 py-1.5 font-sans text-[0.78rem] font-medium text-ink-soft no-underline transition-all hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {t.tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Searches */}
            <div>
              <p className="mb-3 font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">
                Try Searching
              </p>
              <div className="space-y-1.5 font-serif text-[0.95rem] text-ink-soft">
                {["infrastructure", "AI", "leadership", "Taiwan", "branding"].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="block text-ink-soft no-underline transition-colors hover:text-accent"
                  >
                    &ldquo;{term}&rdquo;
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
