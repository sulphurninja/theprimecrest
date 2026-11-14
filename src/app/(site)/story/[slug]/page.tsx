import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleBody } from "@/components/site/ArticleBody";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { ArrowIcon, ExternalIcon, IssueIcon } from "@/components/site/Icons";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { SectionTitle } from "@/components/site/SectionHead";
import { ShareBar } from "@/components/site/ShareBar";
import { getActiveAd, getPublishedArticle, getRelatedArticles } from "@/lib/queries";
import { MAGAZINE_ISSUES, issueLabel } from "@/lib/magazines";
import { buildMetadata, newsArticleJsonLd } from "@/lib/seo";
import { formatDate, siteUrl } from "@/lib/utils";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug).catch(() => null);
  if (!article) return buildMetadata({ title: "Story not found", noIndex: true });
  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || article.dek,
    path: `/story/${article.slug}`,
    image: article.ogImage || article.coverImage,
    type: "article",
    publishedTime: article.publishedAt || undefined,
    modifiedTime: article.updatedAt || undefined,
    authors: article.author?.name ? [article.author.name] : undefined,
    section: article.category?.name,
    tags: article.tags,
    noIndex: article.noIndex,
  });
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug).catch(() => null);
  if (!article) notFound();

  const categoryId =
    typeof article.category === "object" && article.category
      ? String(article.category._id)
      : String(article.category);

  const [related, sidebarAd, inlineAd] = await Promise.all([
    getRelatedArticles(String(article._id), categoryId, 4).catch(() => []),
    article.allowAds ? getActiveAd("article-sidebar").catch(() => null) : null,
    article.allowAds ? getActiveAd("article-inline").catch(() => null) : null,
  ]);

  const magazineHref =
    article.magazineEnabled === false ? "" : String(article.magazineUrl || "").trim();
  const issue = MAGAZINE_ISSUES.find((entry) => entry.articleSlug === article.slug);

  const jsonLd = newsArticleJsonLd({
    headline: article.title,
    description: article.excerpt || article.dek || "",
    image: article.ogImage || article.coverImage,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || undefined,
    authorName: article.author?.name,
    authorUrl: article.author?.slug ? siteUrl(`/author/${article.author.slug}`) : undefined,
    url: siteUrl(`/story/${article.slug}`),
    section: article.category?.name,
  });

  return (
    <article>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Story header */}
      <header className="mx-auto max-w-[900px] px-4 pt-12 text-center sm:px-6 lg:pt-16">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {article.category?.name ? (
            <Link href={`/c/${article.category.slug}`} className="label text-accent no-underline hover:text-accent-hover">
              {article.category.name}
            </Link>
          ) : null}
          {issue ? (
            <>
              <span className="h-1 w-1 rounded-full bg-ink/25" aria-hidden />
              <span className="label text-muted">{issueLabel(issue)}</span>
            </>
          ) : null}
        </div>
        <h1 className="statement mt-5 text-[2.3rem] sm:text-[3.2rem] lg:text-[3.9rem]">{article.title}</h1>
        {article.dek ? (
          <p className="mx-auto mt-6 max-w-2xl font-serif text-[1.22rem] leading-relaxed text-ink-soft">
            {article.dek}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {article.author?.name ? (
            <Link
              href={`/author/${article.author.slug}`}
              className="flex items-center gap-3 text-left no-underline"
            >
              {article.author.avatar ? (
                <Image
                  src={article.author.avatar}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : null}
              <span>
                <span className="block font-sans text-[0.9rem] font-semibold text-ink hover:text-accent">
                  {article.author.name}
                </span>
                {article.author.title ? (
                  <span className="block font-sans text-[0.76rem] text-muted">{article.author.title}</span>
                ) : null}
              </span>
            </Link>
          ) : null}
          <span className="hidden h-8 w-px bg-ink/15 sm:block" aria-hidden />
          <p className="font-sans text-[0.84rem] text-muted">
            {formatDate(article.publishedAt)}
            {article.readTime ? ` · ${article.readTime} min read` : ""}
          </p>
        </div>

        {magazineHref ? (
          <a
            href={magazineHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group mt-8"
          >
            <IssueIcon className="h-4 w-4" />
            Read it in the digital magazine
            <ExternalIcon className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}
      </header>

      {/* Cover art */}
      {article.coverImage ? (
        <figure className="mx-auto mt-12 max-w-[1320px] px-4 sm:px-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-2 lg:aspect-[2/1]">
            <Image
              src={article.coverImage}
              alt={article.coverCaption || article.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1320px) 1272px, 100vw"
            />
          </div>
          {article.coverCaption || article.coverCredit ? (
            <figcaption className="mx-auto mt-3 flex max-w-[1272px] justify-between gap-6 font-sans text-[0.8rem] text-muted">
              <span>{article.coverCaption}</span>
              {article.coverCredit ? <span className="shrink-0">{article.coverCredit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* Body */}
      <div className="mx-auto max-w-[768px] px-4 pb-6 pt-12 sm:px-6 lg:pt-16">
        <div className="mb-10 border-b border-ink/10 pb-6">
          <ShareBar title={article.title} slug={article.slug} magazineUrl={magazineHref || undefined} />
        </div>

        <ArticleBody html={article.content} />

        {article.pullQuote?.text ? (
          <blockquote className="my-12 border-l-2 border-accent pl-7">
            <p className="statement text-[1.7rem] leading-snug">“{article.pullQuote.text}”</p>
            {article.pullQuote.attribution ? (
              <cite className="label mt-3 block not-italic text-muted">{article.pullQuote.attribution}</cite>
            ) : null}
          </blockquote>
        ) : null}

        {inlineAd ? (
          <div className="my-12">
            <AdUnit slot={inlineAd.slot} campaign={inlineAd.campaign} />
          </div>
        ) : null}

        {article.tags?.length ? (
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="label mr-2 text-muted">Filed under</span>
            {article.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-[2px] border border-ink/20 px-3.5 py-1.5 font-sans text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-soft no-underline transition-colors hover:border-ink hover:text-ink"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-ink/10 pt-6">
          <ShareBar title={article.title} slug={article.slug} magazineUrl={magazineHref || undefined} />
        </div>

        {/* From the magazine */}
        {issue ? (
          <aside className="card mt-12 grid grid-cols-[96px_1fr] items-center gap-6 p-5 sm:grid-cols-[120px_1fr] sm:p-6">
            <a
              href={issue.magazineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-[3px] shadow-[0_16px_32px_-16px_rgba(14,14,16,0.6)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={issue.cover} alt={`PrimeCrest ${issueLabel(issue)}: ${issue.name}`} className="aspect-[3/4] w-full object-cover" />
            </a>
            <div>
              <p className="label text-accent">From the {issueLabel(issue)}</p>
              <p className="statement mt-2 text-[1.35rem]">Read the full edition, page by page</p>
              <p className="mt-2 text-[0.92rem] text-ink-soft">
                {issue.name}&apos;s story as it runs in the flipbook, designed like print.
              </p>
              <a
                href={issue.magazineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary group mt-4 !py-2"
              >
                Open the flipbook
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </aside>
        ) : null}

        {/* Author */}
        {article.author?.name ? (
          <div className="mt-12 flex gap-5 border-t border-ink/10 pt-8">
            {article.author.avatar ? (
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="label text-muted">About the author</p>
              <Link
                href={`/author/${article.author.slug}`}
                className="headline mt-1.5 block text-[1.2rem] no-underline hover:text-accent"
              >
                {article.author.name}
              </Link>
              {article.author.bio ? (
                <p className="mt-2 font-serif text-[0.98rem] leading-relaxed text-ink-soft">{article.author.bio}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {sidebarAd ? (
          <div className="mt-12">
            <AdUnit slot={sidebarAd.slot} campaign={sidebarAd.campaign} className="mx-auto max-w-[300px]" />
          </div>
        ) : null}
      </div>

      {/* Keep reading */}
      {related.length ? (
        <section className="mt-12 border-t border-ink/10 bg-paper-2">
          <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6">
            <SectionTitle
              title="Keep reading"
              href={article.category?.slug ? `/c/${article.category.slug}` : undefined}
              linkLabel={article.category?.name ? `More in ${article.category.name}` : undefined}
            />
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {(related as CardArticle[]).map((item) => (
                <ArticleCard key={item._id} article={item} variant="feature" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
