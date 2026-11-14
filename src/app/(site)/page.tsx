import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { Reveal } from "@/components/site/Reveal";
import { MagazineMarquee } from "@/components/site/MagazineMarquee";
import { NewsDesk } from "@/components/site/NewsDesk";
import { SectionTitle } from "@/components/site/SectionHead";
import { MAGAZINE_ISSUES, issueLabel } from "@/lib/magazines";
import { NEWS_TOPICS, getNews, newsCredit } from "@/lib/news";
import { getActiveAd, getHomePayload, getTrendingArticles } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: SITE.name,
  description: SITE.description,
  path: "/",
});

const container = "mx-auto max-w-[1320px] px-4 sm:px-6";
const issueBySlug = new Map(MAGAZINE_ISSUES.map((issue) => [issue.articleSlug, issue]));

/** Live news band. Renders nothing until the news API returns headlines. */
async function NewsSection() {
  const items = await getNews("business", 10);
  if (items.length < 3) return null;
  return (
    <section className="border-y border-ink/10 bg-surface" aria-label="World news">
      <div className={`${container} py-20`}>
        <NewsDesk topics={NEWS_TOPICS} initial={items} credit={newsCredit()} />
      </div>
    </section>
  );
}

/** Cover profiles: one tall portrait card, then three standard ones. */
function LeadersInFocus({ articles }: { articles: CardArticle[] }) {
  const [first, ...rest] = articles;
  if (!first) return null;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:items-start">
      <Link href={`/story/${first.slug}`} className="group relative block overflow-hidden bg-ink no-underline shadow-[0_24px_48px_-24px_rgba(14,14,16,0.6)]">
        <span className="relative block aspect-[4/5]">
          {first.coverImage ? (
            <Image
              src={first.coverImage}
              alt={first.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 420px, 100vw"
            />
          ) : null}
        </span>
        <span className="block bg-ink px-6 py-5">
          <span className="label block !text-[0.62rem] text-gold-soft">
            {issueBySlug.get(first.slug) ? issueLabel(issueBySlug.get(first.slug)!) : first.category?.name}
          </span>
          <span className="mt-2 block font-display text-[1.35rem] font-semibold leading-snug text-white">
            {first.title}
          </span>
        </span>
      </Link>
      {rest.map((article) => {
        const issue = issueBySlug.get(article.slug);
        return (
          <article key={article._id} className="group bg-surface shadow-[0_18px_40px_-28px_rgba(14,14,16,0.5)] lg:mt-4">
            <Link href={`/story/${article.slug}`} className="img-hover relative block aspect-square overflow-hidden bg-paper-2">
              {article.coverImage ? (
                <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="320px" />
              ) : null}
            </Link>
            <div className="p-5">
              {issue ? <p className="label !text-[0.6rem] text-accent">{issueLabel(issue)}</p> : null}
              <h3 className="headline mt-2 text-[1.15rem] leading-snug">
                <Link href={`/story/${article.slug}`}>{article.title}</Link>
              </h3>
              <Link href={`/story/${article.slug}`} className="read-more mt-4 text-ink">
                Read more »
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** Dark text panel beside a large photograph, for the top non-magazine story. */
function FeaturePanel({ article }: { article: CardArticle }) {
  return (
    <article className="group grid grid-cols-1 bg-ink text-white lg:grid-cols-12">
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-7">
        <div>
          <p className="label !tracking-[0.28em] text-white/70">{article.category?.name || "Top story"}</p>
          <h2 className="statement mt-5 text-[2.1rem] text-white sm:text-[2.8rem]">
            <Link href={`/story/${article.slug}`}>{article.title}</Link>
          </h2>
          <p className="label mt-5 !tracking-[0.24em] text-white/60">{formatDate(article.publishedAt)}</p>
          {article.dek || article.excerpt ? (
            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-white/65">
              {article.dek || article.excerpt}
            </p>
          ) : null}
        </div>
        <Link href={`/story/${article.slug}`} className="read-more mt-10 self-start text-white">
          Read more »
        </Link>
      </div>
      {article.coverImage ? (
        <Link href={`/story/${article.slug}`} className="relative block min-h-[320px] overflow-hidden lg:col-span-5">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 540px, 100vw"
          />
        </Link>
      ) : null}
    </article>
  );
}

export default async function HomePage() {
  let payload: Awaited<ReturnType<typeof getHomePayload>> | null = null;
  try {
    payload = await getHomePayload();
  } catch {
    payload = null;
  }

  if (!payload?.hero) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-28 text-center">
        <h1 className="statement text-[2.6rem]">Nothing has been published yet</h1>
        <p className="mt-4 font-serif text-ink-soft">
          Seed the database with <code className="font-sans text-sm">bun run seed</code>, then
          refresh this page.
        </p>
      </div>
    );
  }

  const [leaderboard, mid, mpu, footerAd] = await Promise.all([
    payload.showAds ? getActiveAd("header-leaderboard") : null,
    payload.showAds ? getActiveAd("homepage-mid") : null,
    payload.showAds ? getActiveAd("homepage-mpu") : null,
    payload.showAds ? getActiveAd("footer-strip") : null,
  ]);

  const heroArticles = payload.heroArticles as CardArticle[];
  const allBriefing = payload.briefing.filter(Boolean) as CardArticle[];

  // Reporting outside the magazine: the editors' picks first, topped up with the latest posts.
  const seen = new Set<string>();
  const stories = [...allBriefing, ...(payload.latest as CardArticle[])].filter((a) => {
    if (seen.has(a._id) || issueBySlug.has(a.slug) || a.category?.slug === "women-in-business") {
      return false;
    }
    seen.add(a._id);
    return true;
  });
  const [topStory, ...latestStories] = stories;

  const trending = (await getTrendingArticles(6).catch(() => [])) as CardArticle[];

  const rails = payload.rails.filter(
    (rail) =>
      rail.articles.length > 0 &&
      rail.category.slug !== "women-in-business" &&
      rail.category.slug !== "magazine",
  );

  return (
    <div>
      {/* Lead + Must Read */}
      <div className={`${container} pt-8`}>
        <HeroCarousel articles={heroArticles} mustRead={trending} />
      </div>

      {/* Cover profiles */}
      {heroArticles.length > 1 ? (
        <section className={`${container} py-20`}>
          <SectionTitle
            eyebrow="Cover profiles"
            title="Leaders in focus"
            dek={
              <>
                <strong className="font-semibold text-ink">PrimeCrest</strong> profiles the leaders,
                founders and educators redefining their industries, each with a magazine cover, an
                in-depth feature and a complete digital edition.
              </>
            }
            href="/magazine"
          />
          <LeadersInFocus articles={heroArticles.slice(1, 5)} />
        </section>
      ) : null}

      {/* Leaderboard sits between the profiles and the top story, away from the box ad below. */}
      {leaderboard ? (
        <div className={`${container} pb-20`}>
          <AdUnit slot={leaderboard.slot} campaign={leaderboard.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : null}

      {/* Top story */}
      {topStory ? (
        <section className={`${container} pb-20`}>
          <FeaturePanel article={topStory} />
          {latestStories.length ? (
            <div className="mt-12 grid grid-cols-1 gap-10 border-t border-ink pt-10 lg:grid-cols-12">
              {/* Stories fill the row; the box ad, when there is one, takes a ruled column on the right. */}
              <div
                className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${
                  mpu ? "lg:col-span-9" : "lg:col-span-12"
                } ${latestStories.length >= (mpu ? 3 : 4) ? (mpu ? "lg:grid-cols-3" : "lg:grid-cols-4") : ""}`}
              >
                {latestStories.slice(0, mpu ? 3 : 4).map((article) => (
                  <ArticleCard key={article._id} article={article} variant="feature" />
                ))}
              </div>
              {mpu ? (
                <aside className="lg:col-span-3 lg:border-l lg:border-ink/15 lg:pl-8">
                  <div className="mx-auto max-w-[300px] lg:sticky lg:top-24">
                    <AdUnit slot={mpu.slot} campaign={mpu.campaign} />
                  </div>
                </aside>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* World news */}
      <Suspense fallback={null}>
        <NewsSection />
      </Suspense>

      {/* Digital magazines */}
      <MagazineMarquee />

      {mid ? (
        <div className={`${container} pb-16`}>
          <AdUnit slot={mid.slot} campaign={mid.campaign} className="mx-auto max-w-[728px]" />
        </div>
      ) : null}

      {/* The Interview */}
      {payload.interview ? (
        <section className="border-y border-ink/10 bg-surface">
          <div className={`${container} py-20`}>
            <Reveal>
              <SectionTitle eyebrow="In conversation" title="The interview" />
              <ArticleCard article={payload.interview as CardArticle} variant="standard" />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Sections */}
      {rails.map((rail) => (
        <section key={rail.category.slug} className={`${container} pt-20`}>
          <Reveal>
            <SectionTitle
              eyebrow={rail.category.kicker || "Section"}
              title={rail.category.name}
              dek={rail.category.description || undefined}
              href={`/c/${rail.category.slug}`}
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {rail.articles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
              ))}
            </div>
          </Reveal>
        </section>
      ))}

      {payload.more.length > 0 ? (
        <section className={`${container} pt-20`}>
          <SectionTitle eyebrow="Editor's selection" title="More from PrimeCrest" href="/search" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {payload.more.map((article) => (
              <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
            ))}
          </div>
        </section>
      ) : null}

      {footerAd ? (
        <div className={`${container} pt-16`}>
          <AdUnit slot={footerAd.slot} campaign={footerAd.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : null}

      {/* Advertise — the newsletter signup lives in the site footer */}
      {payload.showAdvertiseBand ? (
        <section className={`${container} pt-20`}>
          <div className="flex flex-col gap-5 border-y border-ink py-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label !tracking-[0.28em] text-ink">Partnerships</p>
              <p className="display-caps mt-2 text-[1.8rem]">Place your brand before decision-makers</p>
            </div>
            <Link href="/advertise" className="btn-primary self-start sm:self-auto">
              Advertise with us
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
