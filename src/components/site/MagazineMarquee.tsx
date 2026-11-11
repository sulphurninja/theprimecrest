import Link from "next/link";
import { ArrowIcon } from "@/components/site/Icons";
import { ISSUES_NEWEST_FIRST, LATEST_ISSUE, issueLabel } from "@/lib/magazines";

/** The digital magazine covers, newest first, drifting slowly across an ivory band. */
export function MagazineMarquee() {
  // Two copies back-to-back make the loop seamless.
  const reel = [...ISSUES_NEWEST_FIRST, ...ISSUES_NEWEST_FIRST];
  const count = ISSUES_NEWEST_FIRST.length;

  return (
    <section className="bg-paper-2" aria-label="Digital magazine issues">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-4 pt-20 sm:px-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">
            The Digital Magazine
          </p>
          <h2 className="statement mt-3 text-[2.6rem] sm:text-[3.4rem]">
            People worth <em>knowing</em>
          </h2>
          <p className="mt-4 max-w-lg font-serif text-[1.08rem] leading-relaxed text-ink-soft">
            Each edition is a flipbook designed page by page like print, with a feature story to read
            here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 lg:col-span-5 lg:justify-end">
          <Link
            href={`/story/${LATEST_ISSUE.articleSlug}`}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-sans text-[0.82rem] font-semibold text-white no-underline transition-colors hover:bg-accent"
          >
            Latest issue
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/magazine" className="nav-link font-sans text-[0.82rem] font-semibold text-ink">
            All editions
          </Link>
        </div>
      </div>

      <div className="mag-reel mt-8 pb-20">
        <div className="mag-reel-track">
          {reel.map((issue, i) => {
            const copy = i >= count;
            return (
              <Link
                key={`${issue.slug}-${i}`}
                href={`/story/${issue.articleSlug}`}
                className="mag-reel-item group"
                aria-label={`${issue.name}, ${issueLabel(issue)}: read the feature`}
                tabIndex={copy ? -1 : 0}
                aria-hidden={copy || undefined}
              >
                <span className="mag-reel-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.cover}
                    alt={`PrimeCrest ${issueLabel(issue)}: ${issue.name}`}
                    loading="lazy"
                    draggable={false}
                  />
                  {issue.slug === LATEST_ISSUE.slug ? <span className="mag-reel-badge">New</span> : null}
                </span>
                <span className="mt-5 block font-sans text-[0.98rem] font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
                  {issue.name}
                </span>
                <span className="mt-1 block font-sans text-[0.78rem] text-muted">{issueLabel(issue)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
