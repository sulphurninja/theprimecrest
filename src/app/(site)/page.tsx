import Link from "next/link";
import Image from "next/image";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { LatestPostsTabs } from "@/components/site/LatestPostsTabs";
import { Reveal } from "@/components/site/Reveal";
import { getActiveAd, getHomePayload, getSettings, getTrendingArticles } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: SITE.name,
  description: SITE.description,
  path: "/",
});

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-7 flex items-baseline justify-between border-b-2 border-ink pb-3">
      <h2 className="section-title text-[0.9rem]">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="font-sans text-[0.8rem] font-medium text-muted no-underline transition-colors hover:text-accent"
        >
          View all →
        </Link>
      ) : null}
    </div>
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
        <p className="kicker">The presses are quiet</p>
        <h1 className="headline mt-4 text-[2.5rem]">Nothing has been published yet.</h1>
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

  const featured = payload.featured.filter(Boolean) as CardArticle[];
  const allBriefing = payload.briefing.filter(Boolean) as CardArticle[];
  const wibArticles = allBriefing.filter(
    (a) => a.category?.slug === "women-in-business",
  );
  const briefing = allBriefing.filter(
    (a) => a.category?.slug !== "women-in-business" && a.category?.slug !== "magazine",
  );
  const settings = payload.settings;
  const magazineLink = (settings as { magazineLink?: string })?.magazineLink || "";
  const magazineCover = (settings as { magazineCover?: string })?.magazineCover || "https://folio-one-lemon.vercel.app/issues/saj/cover.jpg";
  const magazineUrl = magazineLink || "https://folio-one-lemon.vercel.app/m/saj";
  const trending = await getTrendingArticles(6).catch(() => []) as CardArticle[];

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
      {/* Hero: three-column — Latest Issue | Featured Story | Latest Posts */}
      <section className="grid gap-8 border-b border-rule py-8 lg:grid-cols-[220px_1fr_280px] lg:gap-0">
        {/* Left — Latest Issue (3D magazine) — on mobile shows AFTER main post */}
        <div className="order-2 lg:order-1 lg:pr-6">
          <p className="mb-4 border-b-2 border-accent pb-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-accent">
            Latest Issue
          </p>
          <div className="magazine-3d mx-auto w-[180px] lg:mx-0 lg:w-full">
            <a
              href={magazineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magazine-cover relative block aspect-[3/4] overflow-hidden shadow-2xl"
            >
              {magazineCover ? (
                <Image
                  src={magazineCover}
                  alt="Latest Issue — PrimeCrest Magazine"
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              ) : (
                <span className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink via-ink/90 to-ink/80 p-5 text-center">
                  <span className="font-serif text-[1.3rem] font-bold leading-tight text-paper">
                    Master of<br />the Deal.
                  </span>
                  <span className="h-px w-10 bg-paper/30" />
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.16em] text-paper/50">
                    PrimeCrest · Vol. I
                  </span>
                </span>
              )}
            </a>
            <p className="mt-3 text-center font-sans text-[0.7rem] text-muted lg:text-left">
              <a
                href={magazineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent no-underline hover:text-accent-hover"
              >
                Read Digital Issue →
              </a>
            </p>
          </div>
        </div>

        {/* Center — Main featured article — shows FIRST on mobile */}
        <div className="order-1 lg:order-2 lg:border-l lg:border-rule lg:px-6">
          {(payload.hero as CardArticle).coverImage ? (
            <Link
              href={`/story/${(payload.hero as CardArticle).slug}`}
              className="img-hover relative mb-5 block aspect-[16/9] bg-paper-2"
            >
              <Image
                src={(payload.hero as CardArticle).coverImage!}
                alt={(payload.hero as CardArticle).title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 640px, 100vw"
              />
            </Link>
          ) : null}
          {(payload.hero as CardArticle).category?.name ? (
            <Link
              href={`/c/${(payload.hero as CardArticle).category!.slug}`}
              className="kicker no-underline"
            >
              {(payload.hero as CardArticle).category!.name}
            </Link>
          ) : null}
          <h1 className="headline mt-2 text-[1.8rem] leading-tight sm:text-[2.4rem]">
            <Link href={`/story/${(payload.hero as CardArticle).slug}`}>
              {(payload.hero as CardArticle).title}
            </Link>
          </h1>
          {(payload.hero as CardArticle).dek ? (
            <p className="dek mt-3 max-w-xl text-[1.05rem]">
              {(payload.hero as CardArticle).dek}
            </p>
          ) : null}
          <p className="meta mt-3">
            {(payload.hero as CardArticle).author?.name ? (
              <>
                By{" "}
                <span className="font-medium text-ink-soft">
                  {(payload.hero as CardArticle).author!.name}
                </span>
              </>
            ) : null}
            {(payload.hero as CardArticle).readTime ? (
              <> · {(payload.hero as CardArticle).readTime} min read</>
            ) : null}
          </p>
        </div>

        {/* Right — Latest Posts / Trending / Most Shared */}
        <aside className="order-3 lg:border-l lg:border-rule lg:pl-6">
          <LatestPostsTabs latest={featured.slice(0, 6)} trending={trending} />
        </aside>
      </section>

      {leaderboard ? (
        <div className="border-t border-rule py-8">
          <AdUnit slot={leaderboard.slot} campaign={leaderboard.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : null}

      {/* The Briefing + sidebar */}
      <section className="border-t border-rule py-12">
        <Reveal>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-8 lg:pr-10">
            <SectionHeader title="The Briefing" />
            <div className="grid gap-10 sm:grid-cols-2">
              {briefing.slice(0, 4).map((article) => (
                <ArticleCard key={article._id} article={article} variant="feature" />
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
            {mpu ? <AdUnit slot={mpu.slot} campaign={mpu.campaign} /> : null}
            {payload.showNewsletter ? (
              <div className="mt-10 border-t-2 border-ink pt-6">
                <p className="kicker">The Morning Letter</p>
                <h3 className="headline mt-2 text-[1.5rem]">
                  The day&apos;s sharpest reading, in one email.
                </h3>
                <p className="mt-2.5 mb-5 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
                  A considered briefing from our editors, weekday mornings. No aggregation, no
                  filler — just what matters and why.
                </p>
                <NewsletterForm />
              </div>
            ) : null}
          </aside>
        </div>
        </Reveal>
      </section>

      {/* Mid-page ad */}
      {mid ? (
        <div className="border-t border-rule py-8">
          <AdUnit slot={mid.slot} campaign={mid.campaign} className="mx-auto max-w-[728px]" />
        </div>
      ) : null}

      {/* The Interview */}
      {payload.interview ? (
        <section className="border-t border-rule py-12">
          <Reveal>
            <SectionHeader title="The Interview" />
            <ArticleCard article={payload.interview as CardArticle} variant="standard" />
          </Reveal>
        </section>
      ) : null}

      {/* Women in Business */}
      {wibArticles.length > 0 ? (
        <section className="border-t border-rule py-12">
          <Reveal>
            <SectionHeader title="Women in Business" href="/c/women-in-business" />
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {wibArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article._id} article={article} variant="feature" />
              ))}
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Section rails */}
      {payload.rails
        .filter((rail) => rail.articles.length > 0 && rail.category.slug !== "women-in-business" && rail.category.slug !== "magazine")
        .map((rail) => (
          <section key={rail.category.slug} className="border-t border-rule py-12">
            <Reveal>
              <SectionHeader title={rail.category.name} href={`/c/${rail.category.slug}`} />
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {rail.articles.slice(0, 4).map((article) => (
                  <ArticleCard key={article._id} article={article as CardArticle} variant="feature" />
                ))}
              </div>
            </Reveal>
          </section>
        ))}

      {/* Advertise band */}
      {payload.showAdvertiseBand ? (
        <section className="-mx-5 bg-ink text-paper lg:-mx-8">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-paper/50">
                Advertise with us
              </p>
              <h2 className="headline mt-4 text-[2.2rem] text-paper sm:text-[2.8rem]">
                Reach the people who still read.
              </h2>
            </div>
            <div>
              <p className="max-w-md font-serif text-[1.02rem] leading-relaxed text-paper/75">
                PrimeCrest reaches executives, investors, policymakers, and the quietly ambitious.
                Reserved placements, sponsorships, and native features — set with the same care
                as the journalism around them.
              </p>
              <Link
                href="/advertise"
                className="mt-7 inline-flex items-center border border-paper/60 px-6 py-3 font-sans text-[0.82rem] font-semibold text-paper no-underline transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                View the media kit
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {footerAd ? (
        <div className="py-8">
          <AdUnit slot={footerAd.slot} campaign={footerAd.campaign} className="mx-auto max-w-[970px]" />
        </div>
      ) : null}
    </div>
  );
}
