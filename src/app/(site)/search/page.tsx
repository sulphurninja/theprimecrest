import { Suspense } from "react";
import Link from "next/link";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { PageHero } from "@/components/site/PageHero";
import { SearchForm } from "@/components/site/SearchForm";
import { SectionTitle } from "@/components/site/SectionHead";
import {
  searchArticles,
  getTrendingArticles,
  getPopularTags,
  getNavCategories,
} from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search the PrimeCrest archive of reporting, features, and analysis.",
  path: "/search",
  noIndex: true,
});

type Props = { searchParams: Promise<{ q?: string }> };

const chip =
  "rounded-[2px] border border-ink/20 bg-surface px-4 py-2 font-sans text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink no-underline transition-colors hover:border-ink hover:bg-ink hover:text-white";

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const [results, trending, tags, categories] = await Promise.all([
    q ? searchArticles(q).catch(() => []) : Promise.resolve([]),
    getTrendingArticles(6),
    getPopularTags(12),
    getNavCategories(),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="The archive"
        title={q ? <>Results for &ldquo;{q}&rdquo;</> : "Search the archive"}
        dek={q ? undefined : "Cover stories, interviews and analysis from every edition of PrimeCrest."}
      >
        <div className="max-w-2xl">
          <Suspense>
            <SearchForm />
          </Suspense>
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        {q ? (
          <>
            <div className="mb-10 flex items-center justify-between gap-4">
              <p className="font-sans text-[0.9rem] text-ink-soft">
                <span className="font-semibold text-ink">{results.length}</span>{" "}
                {results.length === 1 ? "story" : "stories"} found
              </p>
              <Link href="/search" className="nav-link font-sans text-[0.84rem] font-semibold text-ink">
                Clear search
              </Link>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {(results as CardArticle[]).map((article) => (
                  <ArticleCard key={article._id} article={article} variant="feature" />
                ))}
              </div>
            ) : (
              <div className="card px-6 py-20 text-center">
                <p className="statement text-[1.6rem]">No stories match that search</p>
                <p className="mt-3 font-serif text-ink-soft">
                  Try a broader phrase or a name, or browse a section below.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {categories.map((cat: { _id: string; name: string; slug: string }) => (
                    <Link key={cat._id} href={`/c/${cat.slug}`} className={chip}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <SectionTitle title="Most read" />
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
                {(trending as CardArticle[]).slice(0, 4).map((article) => (
                  <ArticleCard key={article._id} article={article} variant="feature" />
                ))}
              </div>
            </section>

            <aside className="space-y-12 lg:col-span-4">
              <div>
                <p className="label mb-4 text-accent">Browse sections</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: { _id: string; name: string; slug: string }) => (
                    <Link key={cat._id} href={`/c/${cat.slug}`} className={chip}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              {tags.length ? (
                <div>
                  <p className="label mb-4 text-accent">Popular topics</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t: { tag: string; count: number }) => (
                      <Link key={t.tag} href={`/search?q=${encodeURIComponent(t.tag)}`} className={chip}>
                        {t.tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="label mb-3 text-accent">More from the archive</p>
                {(trending as CardArticle[]).slice(4).map((article) => (
                  <ArticleCard key={article._id} article={article} variant="list" />
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
