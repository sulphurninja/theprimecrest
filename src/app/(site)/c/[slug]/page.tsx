import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { getActiveAd, getCategoryArticles, getCategoryBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

const PAGE_SIZE = 13;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return buildMetadata({ title: "Section not found", noIndex: true });
  return buildMetadata({
    title: category.seoTitle || category.name,
    description:
      category.seoDescription ||
      category.description ||
      `The latest ${category.name} coverage from PrimeCrest.`,
    path: `/c/${category.slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const [{ items, total }, topAd] = await Promise.all([
    getCategoryArticles(String(category._id), page, PAGE_SIZE),
    getActiveAd("category-top").catch(() => null),
  ]);

  const articles = items as CardArticle[];
  const lead = page === 1 ? articles[0] : null;
  const rest = page === 1 ? articles.slice(1) : articles;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
      {/* Section masthead */}
      <header className="border-b-2 border-ink py-12">
        {category.kicker ? <p className="kicker">{category.kicker}</p> : null}
        <h1 className="headline mt-2 text-[2.6rem] sm:text-[3.4rem]">{category.name}</h1>
        {category.description ? (
          <p className="dek mt-4 max-w-2xl">{category.description}</p>
        ) : null}
      </header>

      {topAd ? (
        <div className="border-b border-rule py-8">
          <AdUnit slot={topAd.slot} campaign={topAd.campaign} className="mx-auto max-w-[728px]" />
        </div>
      ) : null}

      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="headline text-[1.6rem]">Nothing here yet.</p>
          <p className="mt-3 font-serif text-ink-soft">
            The desk hasn&apos;t filed anything in this section. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {lead ? (
            <section className="border-b border-rule py-12">
              <ArticleCard article={lead} variant="cover" />
            </section>
          ) : null}

          <section className="grid gap-x-10 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article._id} article={article} variant="feature" />
            ))}
          </section>

          {totalPages > 1 ? (
            <nav
              className="flex items-center justify-between border-t border-rule py-8"
              aria-label="Pagination"
            >
              {page > 1 ? (
                <Link
                  href={`/c/${category.slug}?page=${page - 1}`}
                  className="btn-outline !px-4 !py-2"
                >
                  ← Newer
                </Link>
              ) : (
                <span />
              )}
              <span className="meta">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/c/${category.slug}?page=${page + 1}`}
                  className="btn-outline !px-4 !py-2"
                >
                  Older →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
