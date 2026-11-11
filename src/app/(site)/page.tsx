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
import { ArrowIcon } from "@/components/site/Icons";
import {
  MagazineCoverGrid,
  magazineShelfMeta,
  type MagazineShelfItem,
} from "@/components/site/MagazineCoverGrid";
import { MAGAZINE_ISSUES } from "@/lib/magazines";
import { NEWS_TOPICS, getNews, newsCredit } from "@/lib/news";
import { getActiveAd, getHomePayload, getSectionMagazines } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { formatDate, timeAgo } from "@/lib/utils";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: SITE.name,
  description: SITE.description,
  path: "/",
});

const container = "mx-auto max-w-[1320px] px-4 sm:px-6";
const magazineSlugs = new Set(MAGAZINE_ISSUES.map((issue) => issue.articleSlug));

/** Live news band. Renders nothing until the news API returns headlines. */
async function NewsSection() {
  const items = await getNews("business", 10);
  if (items.length < 3) return null;
  return (
    <section className="border-y border-ink/10 bg-surface" aria-label="Live news">
      <div className={`${container} py-20`}>
        <NewsDesk topics={NEWS_TOPICS} initial={items} credit={newsCredit()} />
      </div>
    </section>
  );
}

/** "3h ago" for fresh posts, a short date for older ones. */
function when(date?: string) {
  if (!date) return "";
  const hours = (Date.now() - new Date(date).getTime()) / 3_600_000;
  return hours < 48 ? timeAgo(date) : formatDate(date, { month: "short", year: undefined });
}

function LeadStory({ article }: { article: CardArticle }) {
  return (
    <article className="group">
      {article.coverImage ? (
        <Link
          href={`/story/${article.slug}`}
          className="img-hover relative block aspect-[3/2] overflow-hidden rounded-md bg-paper-2"
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 640px, 100vw"
          />
        </Link>
      ) : null}
      {article.category?.name ? (
        <Link href={`/c/${article.category.slug}`} className="label mt-6 block text-accent no-underline">
          {article.category.name}
        </Link>
      ) : null}
      <h3 className="statement mt-2 text-[1.9rem] sm:text-[2.3rem]">
        <Link href={`/story/${article.slug}`}>{article.title}</Link>
      </h3>
      {article.dek || article.excerpt ? (
        <p className="mt-3 font-serif text-[1.06rem] leading-relaxed text-ink-soft line-clamp-3">
          {article.dek || article.excerpt}
        </p>
      ) : null}
      <p className="meta mt-4">
        {article.author?.name ? <span className="font-semibold text-ink">{article.author.name}</span> : null}
        {article.readTime ? ` · ${article.readTime} min read` : ""}
      </p>
    </article>
  );
}

function SecondaryStory({ article }: { article: CardArticle }) {
  return (
    <article className="group border-b border-ink/10 pb-6 last:border-b-0 last:pb-0">
      {article.coverImage ? (
        <Link
          href={`/story/${article.slug}`}
          className="img-hover relative mb-4 block aspect-[16/10] overflow-hidden rounded-md bg-paper-2"
        >
          <Image src={article.coverImage} alt="" fill className="object-cover" sizes="320px" />
        </Link>
      ) : null}
      {article.category?.name ? <p className="label !text-[0.62rem] text-accent">{article.category.name}</p> : null}
      <h3 className="headline mt-1.5 text-[1.08rem] leading-snug">
        <Link href={`/story/${article.slug}`}>{article.title}</Link>
      </h3>
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

  const allBriefing = payload.briefing.filter(Boolean) as CardArticle[];
  const wibArticles = allBriefing.filter((a) => a.category?.slug === "women-in-business");

  // Today's briefing: the editors' picks first, topped up with the latest non-magazine posts.
  const seen = new Set<string>();
  const topStories = [...allBriefing, ...(payload.latest as CardArticle[])].filter((a) => {
    if (seen.has(a._id) || magazineSlugs.has(a.slug) || a.category?.slug === "women-in-business") {
      return false;
    }
    seen.add(a._id);
    return true;
  });
  const [lead, ...others] = topStories;
  const latest = (payload.latest as CardArticle[]).slice(0, 6);

  const wibMagazines = (await getSectionMagazines("women-in-business").catch(
    () => [],
  )) as MagazineShelfItem[];
  const [wibLead, ...wibRest] = wibMagazines;
  const wibLeadMeta = wibLead ? magazineShelfMeta(wibLead) : null;

  const rails = payload.rails.filter(
    (rail) =>
      rail.articles.length > 0 &&
      rail.category.slug !== "women-in-business" &&
      rail.category.slug !== "magazine",
  );

  return (
    <div>
      {/* Cover stories */}
      <div className={`${container} pb-16 pt-10 lg:pt-12`}>
        <HeroCarousel articles={payload.heroArticles as CardArticle[]} />
      </div>

      {/* Today's briefing */}
      {lead ? (
        <section className="border-t border-ink/10 bg-surface">
          <div className={`${container} py-16`}>
            <SectionTitle title="Today's briefing" href="/search" linkLabel="All stories" />
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
              <div className="md:col-span-2 lg:col-span-6">
                <LeadStory article={lead} />
              </div>
              {others.length ? (
                <div className="space-y-6 lg:col-span-3">
                  {others.slice(0, 2).map((article) => (
                    <SecondaryStory key={article._id} article={article} />
                  ))}
                </div>
              ) : null}
              <aside className="lg:col-span-3 lg:border-l lg:border-ink/10 lg:pl-8">
                <p className="label flex items-center gap-2 text-accent">
                  <span className="wire-pulse !h-1.5 !w-1.5" aria-hidden /> Latest
                </p>
                <ol className="mt-4">
                  {latest.map((article) => (
                    <li key={article._id} className="group relative border-l border-ink/10 pb-5 pl-5 last:pb-0">
                      <span className="absolute -left-[4px] top-1.5 h-[7px] w-[7px] rounded-full border border-ink/25 bg-surface transition-colors group-hover:border-accent group-hover:bg-accent" />
                      <p className="font-sans text-[0.72rem] font-semibold text-muted">
                        {when(article.publishedAt)}
                        {article.category?.name ? ` · ${article.category.name}` : ""}
                      </p>
                      <h3 className="headline mt-1 text-[0.96rem] leading-snug">
                        <Link href={`/story/${article.slug}`}>{article.title}</Link>
                      </h3>
                    </li>
                  ))}
                </ol>
                {mpu ? (
                  <div className="mt-8">
                    <AdUnit slot={mpu.slot} campaign={mpu.campaign} />
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </section>
      ) : null}

      {leaderboard ? (
        <div className={`${container} py-12`}>
          <AdUnit slot={leaderboard.slot} campaign={leaderboard.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : null}

      {/* Live news */}
      <Suspense fallback={null}>
        <NewsSection />
      </Suspense>

      {/* Digital magazines */}
      <MagazineMarquee />

      {/* Women in Business */}
      {wibLead && wibLeadMeta ? (
        <section className={`${container} py-20`}>
          <SectionTitle
            eyebrow="A PrimeCrest series"
            title="Women in Business"
            href="/c/women-in-business"
            linkLabel="The full series"
          />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <article className="issue-card group grid grid-cols-1 content-start gap-6 sm:grid-cols-[minmax(0,240px)_1fr] lg:col-span-5 lg:grid-cols-1">
              <Link
                href={`/story/${wibLead.slug}`}
                className="issue-cover max-w-[340px]"
                aria-label={`${wibLeadMeta.name}: read the feature`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wibLeadMeta.cover} alt={`PrimeCrest ${wibLeadMeta.label}: ${wibLeadMeta.name}`} />
              </Link>
              <div>
                <p className="label text-accent">
                  Latest in the series{wibLeadMeta.label ? ` · ${wibLeadMeta.label}` : ""}
                </p>
                <h3 className="statement mt-2 text-[1.9rem]">
                  <Link href={`/story/${wibLead.slug}`}>{wibLeadMeta.name}</Link>
                </h3>
                {wibLeadMeta.role ? <p className="mt-1 text-[0.88rem] text-muted">{wibLeadMeta.role}</p> : null}
                {wibLeadMeta.title ? (
                  <p className="mt-3 font-serif text-[1.15rem] italic text-ink-soft">{wibLeadMeta.title}</p>
                ) : null}
              </div>
            </article>
            {wibRest.length ? (
              <div className="lg:col-span-7">
                <MagazineCoverGrid items={wibRest} columns={3} />
              </div>
            ) : null}
          </div>
        </section>
      ) : wibArticles.length > 0 ? (
        <section className={`${container} py-20`}>
          <SectionTitle eyebrow="A PrimeCrest series" title="Women in Business" href="/c/women-in-business" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {wibArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article._id} article={article} variant="feature" />
            ))}
          </div>
        </section>
      ) : null}

      {mid ? (
        <div className={`${container} pb-16`}>
          <AdUnit slot={mid.slot} campaign={mid.campaign} className="mx-auto max-w-[728px]" />
        </div>
      ) : null}

      {/* The Interview */}
      {payload.interview ? (
        <section className="border-y border-ink/10 bg-surface">
          <div className={`${container} py-16`}>
            <Reveal>
              <SectionTitle eyebrow="In conversation" title="The Interview" />
              <ArticleCard article={payload.interview as CardArticle} variant="standard" />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Sections: title column beside its latest stories */}
      {rails.length ? (
        <div className={`${container} py-6`}>
          {rails.map((rail) => (
            <section
              key={rail.category.slug}
              className="grid grid-cols-1 gap-8 border-b border-ink/10 py-14 last:border-b-0 lg:grid-cols-12 lg:gap-12"
            >
              <Reveal className="lg:col-span-3">
                <p className="label text-accent">{rail.category.kicker || "Section"}</p>
                <h2 className="statement mt-2 text-[2rem] sm:text-[2.4rem]">{rail.category.name}</h2>
                {rail.category.description ? (
                  <p className="mt-3 font-serif text-[1rem] leading-relaxed text-ink-soft line-clamp-4">
                    {rail.category.description}
                  </p>
                ) : null}
                <Link href={`/c/${rail.category.slug}`} className="btn-outline group mt-6 !py-2">
                  All {rail.category.name}
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
              <Reveal className="lg:col-span-9">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
                  {rail.articles.slice(0, 3).map((article) => (
                    <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
                  ))}
                </div>
              </Reveal>
            </section>
          ))}
        </div>
      ) : null}

      {payload.more.length > 0 ? (
        <section className="border-t border-ink/10 bg-surface">
          <div className={`${container} py-16`}>
            <SectionTitle title="More to read" />
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {payload.more.map((article) => (
                <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
              ))}
            </div>
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
        <section className={`${container} pt-16`}>
          <div className="flex flex-col gap-4 rounded-lg bg-paper-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <p className="label text-accent">Partnerships</p>
              <p className="statement mt-1.5 text-[1.5rem]">Reach the people who still read</p>
            </div>
            <Link href="/advertise" className="btn-primary group self-start sm:self-auto">
              Advertise with us
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
