import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleBody } from "@/components/site/ArticleBody";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ReadingProgress } from "@/components/site/ReadingProgress";
import { ShareBar } from "@/components/site/ShareBar";
import { getActiveAd, getPublishedArticle, getRelatedArticles } from "@/lib/queries";
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
      <header className="mx-auto max-w-[840px] px-5 pt-12 text-center lg:px-8">
        {article.category?.name ? (
          <Link href={`/c/${article.category.slug}`} className="kicker no-underline">
            {article.category.name}
          </Link>
        ) : null}
        <h1 className="headline mt-4 text-[2.1rem] sm:text-[2.9rem] lg:text-[3.4rem]">
          {article.title}
        </h1>
        {article.dek ? (
          <p className="dek mx-auto mt-5 max-w-2xl text-[1.22rem]">{article.dek}</p>
        ) : null}

        <div className="mt-7 flex flex-col items-center gap-1.5">
          {article.author?.name ? (
            <p className="font-sans text-[0.9rem] font-medium">
              By{" "}
              <Link
                href={`/author/${article.author.slug}`}
                className="no-underline hover:text-accent"
              >
                {article.author.name}
              </Link>
              {article.author.title ? (
                <span className="font-normal text-muted"> · {article.author.title}</span>
              ) : null}
            </p>
          ) : null}
          <p className="meta">
            {formatDate(article.publishedAt)}
            {article.readTime ? ` · ${article.readTime} min read` : ""}
          </p>
        </div>
      </header>

      {/* Cover art */}
      {article.coverImage ? (
        <figure className="mx-auto mt-10 max-w-[1280px] px-5 lg:px-8">
          <div className="relative aspect-[16/8] w-full bg-paper-2">
            <Image
              src={article.coverImage}
              alt={article.coverCaption || article.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          </div>
          {article.coverCaption || article.coverCredit ? (
            <figcaption className="mt-2.5 flex justify-between gap-6 font-sans text-[0.8rem] text-muted">
              <span>{article.coverCaption}</span>
              {article.coverCredit ? <span className="shrink-0">{article.coverCredit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      {/* Body + rail */}
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-8 lg:pr-14">
            <div className="mx-auto max-w-[680px]">
              <div className="mb-8 border-b border-rule pb-5">
                <ShareBar title={article.title} slug={article.slug} />
              </div>

              <ArticleBody html={article.content} />

              {article.pullQuote?.text ? (
                <blockquote className="my-12 border-l-2 border-accent pl-7">
                  <p className="headline text-[1.7rem] leading-snug">
                    “{article.pullQuote.text}”
                  </p>
                  {article.pullQuote.attribution ? (
                    <cite className="mt-3 block font-sans text-[0.78rem] font-semibold uppercase not-italic tracking-[0.1em] text-muted">
                      {article.pullQuote.attribution}
                    </cite>
                  ) : null}
                </blockquote>
              ) : null}

              {inlineAd ? (
                <div className="my-12">
                  <AdUnit slot={inlineAd.slot} campaign={inlineAd.campaign} />
                </div>
              ) : null}

              {article.tags?.length ? (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-rule pt-6">
                  <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">
                    Filed under
                  </span>
                  {article.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="border border-rule px-2.5 py-1 font-sans text-[0.78rem] text-ink-soft no-underline transition-colors hover:border-ink"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 border-t border-rule pt-6">
                <ShareBar title={article.title} slug={article.slug} />
              </div>

              {/* Author card */}
              {article.author?.name ? (
                <div className="mt-10 flex gap-5 border-t-2 border-ink pt-7">
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
                    <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted">
                      About the author
                    </p>
                    <Link
                      href={`/author/${article.author.slug}`}
                      className="headline mt-1 block text-[1.25rem] no-underline hover:text-accent"
                    >
                      {article.author.name}
                    </Link>
                    {article.author.bio ? (
                      <p className="mt-2 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
                        {article.author.bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar rail */}
          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
            <div className="lg:sticky lg:top-24">
              {sidebarAd ? <AdUnit slot={sidebarAd.slot} campaign={sidebarAd.campaign} /> : null}

              {related.length ? (
                <div className={sidebarAd ? "mt-10" : ""}>
                  <h2 className="section-title border-b-2 border-ink pb-3">Related reading</h2>
                  {(related as CardArticle[]).map((item) => (
                    <ArticleCard key={item._id} article={item} variant="list" />
                  ))}
                </div>
              ) : null}

              <div className="mt-10 border-t-2 border-ink pt-6">
                <p className="kicker">The Morning Letter</p>
                <p className="mt-2 mb-4 font-serif text-[0.92rem] leading-relaxed text-ink-soft">
                  The day&apos;s sharpest reading, delivered weekday mornings.
                </p>
                <NewsletterForm />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
