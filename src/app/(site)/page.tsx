import Link from "next/link";
import { AdUnit } from "@/components/site/AdUnit";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { FeaturedCarousel } from "@/components/site/FeaturedCarousel";
import { Reveal } from "@/components/site/Reveal";
import { getActiveAd, getHomePayload } from "@/lib/queries";
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
  const briefing = payload.briefing.filter(Boolean) as CardArticle[];
  const lead = [payload.hero as CardArticle, ...featured.slice(0, 3)];

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
      {/* Lead well: featured carousel + latest rail */}
      <section className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-0">
        <div className="lg:col-span-8 lg:pr-10">
          <FeaturedCarousel articles={lead} />
        </div>
        <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
          <h2 className="section-title mb-2 border-b-2 border-ink pb-3">The Latest</h2>
          {featured.slice(0, 5).map((article) => (
            <ArticleCard key={article._id} article={article} variant="compact" />
          ))}
          <Link
            href="/search"
            className="mt-5 inline-block font-sans text-[0.8rem] font-medium text-muted no-underline hover:text-accent"
          >
            Browse the archive →
          </Link>
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

      {/* Cover story */}
      {payload.cover ? (
        <section className="border-t border-rule py-14">
          <Reveal>
            <ArticleCard article={payload.cover as CardArticle} variant="cover" />
          </Reveal>
        </section>
      ) : null}

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

      {/* Section rails */}
      {payload.rails
        .filter((rail) => rail.articles.length > 0)
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
