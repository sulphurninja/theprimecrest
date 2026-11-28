import { Fragment } from "react";
import { Pagination } from "@/components/site/Pagination";
import { notFound, redirect } from "next/navigation";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { MagazineCoverGrid, type MagazineShelfItem } from "@/components/site/MagazineCoverGrid";
import { SectionTitle } from "@/components/site/SectionHead";
import { getActiveAd, getCategoryArticles, getCategoryBySlug, getMagazineIssues, getSectionMagazines } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

/** A lead story plus a 3 x 4 grid on page one; 12 a page after that. */
const PAGE_SIZE = 13;
/** Covers on the section's magazine shelf; the rest live on /magazine. */
const SHELF_SIZE = 8;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === "magazine") redirect("/magazine");
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
  if (slug === "magazine") redirect("/magazine");
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  // Magazine stories sit on the cover shelf (page one), so the article list
  // leaves them out on every page and each page stays full.
  // Sections can turn the shelf off (Admin -> Sections); their magazine
  // features then list as ordinary story cards.
  const showShelf = category.showMagazineShelf !== false;
  const magazines = showShelf
    ? ((await getSectionMagazines(category.slug).catch(() => [])) as MagazineShelfItem[])
    : [];
  const [{ items, total }, topAd] = await Promise.all([
    getCategoryArticles(
      String(category._id),
      page,
      PAGE_SIZE,
      magazines.map((item) => item._id),
      ((category.pinnedArticles as unknown[]) || []).map(String),
    ),
    getActiveAd("category-top").catch(() => null),
  ]);

  const shelf = page === 1 ? magazines.slice(0, SHELF_SIZE) : [];
  const articles = items as CardArticle[];
  const lead = page === 1 ? articles[0] : null;
  const rest = page === 1 ? articles.slice(1) : articles;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const ad = topAd ? (
    <div className="border-b border-rule py-8">
      <AdUnit slot={topAd.slot} campaign={topAd.campaign} className="mx-auto max-w-[728px]" />
    </div>
  ) : null;

  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
      {/* Section masthead */}
      <header className="border-b border-ink pb-12 pt-14 lg:pt-20">
        {category.kicker ? (
          <p className="label !tracking-[0.28em] text-ink">{category.kicker}</p>
        ) : null}
        <h1 className="display-caps mt-4 text-[2.8rem] sm:text-[3.8rem] lg:text-[4.6rem]">
          {category.name}
        </h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          {category.description ? (
            <p className="max-w-2xl text-[1.08rem] leading-[1.75] text-ink-soft">{category.description}</p>
          ) : (
            <span />
          )}
          <p className="label text-muted">
            {total > 0 ? `${total} ${total === 1 ? "story" : "stories"} · ` : ""}Newest first
          </p>
        </div>
      </header>

      {shelf.length ? (
        <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-paper-2">
          <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
            <SectionTitle
              eyebrow="The covers · Newest first"
              title="On the magazine stand"
              href="/magazine"
              linkLabel={magazines.length > SHELF_SIZE ? `All ${magazines.length} editions` : "Every issue"}
            />
            <MagazineCoverGrid items={shelf} issues={await getMagazineIssues()} />
          </div>
        </section>
      ) : null}

      {articles.length === 0 && shelf.length === 0 ? (
        <div className="py-24 text-center">
          <p className="statement text-[2rem]">No stories in this section yet</p>
          <p className="mt-3 font-serif text-ink-soft">
            New reporting will appear here as it is published.
          </p>
        </div>
      ) : articles.length > 0 ? (
        <>
          {lead ? (
            <section className="border-b border-ink/10 py-14">
              <ArticleCard article={lead} variant="cover" />
            </section>
          ) : null}

          {ad && lead ? ad : null}

          <section className="grid grid-cols-1 gap-x-10 gap-y-12 py-12 empty:hidden sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article, index) => (
              <Fragment key={article._id}>
                <ArticleCard article={article} variant="feature" />
                {ad && !lead && index === 0 ? (
                  <div className="sm:col-span-2 lg:col-span-3">{ad}</div>
                ) : null}
              </Fragment>
            ))}
          </section>

          <Pagination
            page={page}
            totalPages={totalPages}
            href={(n) => (n === 1 ? `/c/${category.slug}` : `/c/${category.slug}?page=${n}`)}
            className="border-t border-ink/10"
          />
        </>
      ) : null}
    </div>
  );
}
