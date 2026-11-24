import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { Reveal } from "@/components/site/Reveal";
import { NewsDesk } from "@/components/site/NewsDesk";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { ArrowIcon, LetterIcon } from "@/components/site/Icons";
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
    <section className="mt-16 border-y border-ink/10 bg-surface" aria-label="World news">
      <div className={`${container} py-20`}>
        <NewsDesk topics={NEWS_TOPICS} initial={items} credit={newsCredit()} />
      </div>
    </section>
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
  // If that leaves the grid short, fill it with the newest of everything else.
  const fallback = (payload.latest as CardArticle[]).filter((a) => {
    if (seen.has(a._id)) return false;
    seen.add(a._id);
    return true;
  });
  const stories = [...storyPicks, ...automatic, ...fallback];

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

  // Leaders in Focus: the features picked in Admin -> Front Page, topped up with
  // issues 2 to 4 in the magazine order, with their story photos.
  const articleBySlug = new Map(heroArticles.map((a) => [a.slug, a]));
  const leaderSlugs = payload.leaderPicks.filter((slug) => issueBySlug.has(slug));
  for (const issue of issues.slice(1)) {
    if (leaderSlugs.length >= 3) break;
    if (!leaderSlugs.includes(issue.articleSlug)) leaderSlugs.push(issue.articleSlug);
  }
  const leaders = leaderSlugs.map((slug) => ({ issue: issueBySlug.get(slug)!, article: articleBySlug.get(slug) }));

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

      {/* Leaders in Focus | The Digital Magazine */}
      <section className={`${container} grid grid-cols-1 gap-12 pt-16 lg:grid-cols-12 lg:gap-0`}>
        {leaders.length ? (
          <div className="lg:col-span-7 lg:border-r lg:border-gold/50 lg:pr-10">
            <SectionTitle title="Leaders in Focus" href="/magazine" linkLabel="View all profiles" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {leaders.map(({ issue, article }) => (
                <Link
                  key={issue.articleSlug}
                  href={`/story/${issue.articleSlug}`}
                  className="group flex flex-col bg-paper-2 no-underline transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(14,14,16,0.45)]"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-paper-3">
                    {article?.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={issue.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 100vw"
                      />
                    ) : null}
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="font-display text-[1.15rem] font-semibold leading-snug text-ink">{issue.name}</span>
                    {issue.role ? (
                      <span className="mt-0.5 font-serif text-[0.86rem] italic leading-snug text-ink-soft">{issue.role}</span>
                    ) : null}
                    <span className="mt-3 flex flex-1 items-end justify-between gap-3">
                      <span className="font-serif text-[0.9rem] leading-snug text-ink-soft line-clamp-2">{issue.title}</span>
                      <ArrowIcon className="h-4 w-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {issues.length ? (
          <div className={leaders.length ? "lg:col-span-5 lg:pl-10" : "lg:col-span-12"}>
            <SectionTitle title="The Digital Magazine" href="/magazine" linkLabel="Latest editions" />
            <div className="grid grid-cols-3 items-end gap-4">
              {issues.slice(0, 3).map((issue) => (
                <Link
                  key={issue.articleSlug}
                  href={`/story/${issue.articleSlug}`}
                  className="group block no-underline"
                  aria-label={`${issue.name}: read the feature`}
                >
                  <span className="relative block overflow-hidden bg-paper-3 shadow-[0_16px_32px_-18px_rgba(14,14,16,0.6)] transition-transform duration-500 group-hover:-translate-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={issue.cover}
                      alt={`PrimeCrest magazine cover: ${issue.name}`}
                      loading="lazy"
                      className="block h-auto w-full"
                    />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-7 text-center">
              <Link href="/magazine" className="btn-primary group">
                Explore the magazines
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      {/* Latest Articles | newsletter */}
      <section className={`${container} grid grid-cols-1 gap-10 pt-16 lg:grid-cols-12`}>
        <div className="lg:col-span-8">
          <SectionTitle title="Latest Articles" href="/search" linkLabel="View all articles" />
          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-3">
            {stories.slice(0, 6).map((article) => (
              <article key={article._id} className="group">
                <Link href={`/story/${article.slug}`} className="img-hover relative block aspect-[16/10] overflow-hidden bg-paper-2">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 100vw"
                    />
                  ) : null}
                </Link>
                {article.category?.name ? (
                  <Link
                    href={`/c/${article.category.slug}`}
                    className="mt-4 inline-block bg-gold px-2 py-0.5 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white no-underline"
                  >
                    {article.category.name}
                  </Link>
                ) : null}
                <h3 className="mt-2 font-display text-[1.15rem] font-semibold leading-snug text-ink">
                  <Link href={`/story/${article.slug}`} className="hover:text-gold-deep">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-1.5 font-sans text-[0.7rem] font-medium uppercase tracking-[0.08em] text-muted">
                  {[
                    article.publishedAt ? formatDate(article.publishedAt, { month: "short" }) : "",
                    article.readTime ? `${article.readTime} min read` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4">
          {payload.showNewsletter ? (
            <div className="bg-paper-2 p-7">
              <LetterIcon className="h-7 w-7 text-gold-deep" />
              <h2 className="mt-4 font-display text-[1.5rem] font-semibold leading-tight text-ink">
                Stay Informed with PrimeCrest
              </h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                Receive our latest stories, magazine editions and exclusive insights, straight to your
                inbox.
              </p>
              <div className="mt-5">
                <NewsletterForm />
              </div>
              <p className="mt-4 text-[0.8rem] leading-relaxed text-muted">
                Join a global community of leaders, entrepreneurs and forward thinkers.
              </p>
            </div>
          ) : null}
          {mpu ? (
            <div className={payload.showNewsletter ? "mt-8" : ""}>
              <AdUnit slot={mpu.slot} campaign={mpu.campaign} />
            </div>
          ) : null}
        </aside>
      </section>

      {/* Ad band */}
      {leaderboard ? (
        <div className={`${container} pt-16`}>
          <AdUnit slot={leaderboard.slot} campaign={leaderboard.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : payload.showAdvertiseBand ? (
        <div className={`${container} pt-16`}>
          <div className="grid grid-cols-1 items-center gap-6 bg-brand px-8 py-9 text-white sm:grid-cols-[1fr_auto] sm:px-12">
            <div>
              <p className="label !tracking-[0.24em] text-gold-soft">Partnerships</p>
              <p className="mt-2 font-display text-[1.8rem] font-semibold leading-tight text-gold-soft">
                Place your brand before decision-makers
              </p>
              <p className="label mt-2 !tracking-[0.22em] text-white/70">
                Reserved placements for a global readership of leaders
              </p>
            </div>
            <Link
              href="/advertise"
              className="group inline-flex items-center gap-2 justify-self-start border border-gold-soft px-5 py-2.5 font-sans text-[0.86rem] font-semibold text-gold-soft no-underline transition-colors hover:bg-gold-soft hover:text-brand sm:justify-self-end"
            >
              Advertise with us
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : null}

      {/* World business news */}
      <Suspense fallback={null}>
        <NewsSection />
      </Suspense>

      {/* The Interview */}
      {payload.interview ? (
        <section className={`${container} pt-16`}>
          <Reveal>
            <SectionTitle title="The Interview" />
            <ArticleCard article={payload.interview as CardArticle} variant="standard" />
          </Reveal>
        </section>
      ) : null}

      {mid ? (
        <div className={`${container} pt-16`}>
          <AdUnit slot={mid.slot} campaign={mid.campaign} className="mx-auto max-w-[728px]" />
        </div>
      ) : null}

      {/* Section rows */}
      {rails.map((rail) => (
        <section key={rail.category.slug} className={`${container} pt-16`}>
          <Reveal>
            <SectionTitle title={rail.category.name} href={`/c/${rail.category.slug}`} />
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {rail.articles.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
              ))}
            </div>
          </Reveal>
        </section>
      ))}

      {payload.more.length > 0 ? (
        <section className={`${container} pt-16`}>
          <SectionTitle title="More from PrimeCrest" href="/search" />
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
