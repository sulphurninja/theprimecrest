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
import { NEWS_TOPICS, getNews, newsCredit } from "@/lib/news";
import { getActiveAd, getHomePayload, getMagazineIssues, getTrendingArticles } from "@/lib/queries";
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

/**
 * Cover profiles: four identical portrait tiles with the issue and headline
 * set over a soft fade, so the row always lines up whatever the title length.
 */
function LeadersInFocus({ articles }: { articles: CardArticle[] }) {
  if (!articles.length) return null;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
          <Link
            key={article._id}
            href={`/story/${article.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-brand-dark no-underline"
          >
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              />
            ) : null}
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-5">
              <span className="block font-display text-[1.2rem] font-semibold leading-snug text-white line-clamp-3">
                {article.title}
              </span>
              <span className="mt-4 block h-[2px] w-10 bg-gold-soft transition-all duration-500 group-hover:w-20" />
            </span>
          </Link>
      ))}
    </div>
  );
}

/** Dark text panel beside a large photograph, for the top non-magazine story. */
function FeaturePanel({ article }: { article: CardArticle }) {
  return (
    <article className="group grid grid-cols-1 bg-brand text-white lg:grid-cols-12">
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

  const issues = await getMagazineIssues();
  const issueBySlug = new Map(issues.map((issue) => [issue.articleSlug, issue]));
  const heroArticles = payload.heroArticles as CardArticle[];
  // Top story & latest: the editors' picks exactly as chosen (Admin -> Front Page),
  // topped up with the newest reporting outside the magazine and Women in Business.
  const storyPicks = payload.briefingPicks as CardArticle[];
  const seen = new Set<string>(storyPicks.map((a) => a._id));
  const automatic = [
    ...(storyPicks.length ? [] : (payload.briefing as CardArticle[])),
    ...(payload.latest as CardArticle[]),
  ].filter((a) => {
    if (seen.has(a._id) || issueBySlug.has(a.slug) || a.category?.slug === "women-in-business") {
      return false;
    }
    seen.add(a._id);
    return true;
  });
  const stories = [...storyPicks, ...automatic];
  const [topStory, ...latestStories] = stories;

  const trending = (await getTrendingArticles(10).catch(() => [])) as CardArticle[];
  // Must Read: the editors' picks in their order (Admin -> Front Page), topped up
  // with the most-read stories that aren't already in the cover carousel.
  const mustReadSeen = new Set<string>(heroArticles.map((a) => a._id));
  const mustReadPicks = payload.mustReadPicks.filter(Boolean) as CardArticle[];
  const mustRead = [
    ...mustReadPicks,
    ...trending.filter((a) => {
      if (mustReadSeen.has(a._id) || mustReadPicks.some((p) => p._id === a._id)) return false;
      mustReadSeen.add(a._id);
      return true;
    }),
  ].slice(0, 4);

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
        <HeroCarousel articles={heroArticles} mustRead={mustRead} issues={issues} />
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
