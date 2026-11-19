import Link from "next/link";
import { SectionTitle } from "@/components/site/SectionHead";
import { getMagazineIssues } from "@/lib/queries";

/** The digital magazine covers, newest first, drifting slowly across an ivory band. */
export async function MagazineMarquee() {
  const issues = await getMagazineIssues();
  const latest = issues[0];
  if (!latest) return null;
  // Two copies back-to-back make the loop seamless.
  const reel = [...issues, ...issues];
  const count = issues.length;

  return (
    <section className="bg-paper-2" aria-label="Digital magazine issues">
      <div className="mx-auto max-w-[1320px] px-4 pt-20 sm:px-6">
        <SectionTitle
          eyebrow="The digital magazine"
          title="Latest editions"
          dek={
            <>
              Every PrimeCrest edition is designed page by page and published as a digital flipbook. This month&apos;s cover:{" "}
              <Link href={`/story/${latest.articleSlug}`} className="font-semibold text-ink underline decoration-accent underline-offset-4">
                {latest.name}
              </Link>
              .
            </>
          }
          href="/magazine"
          linkLabel="All editions"
        />
      </div>

      <div className="mag-reel pb-20">
        <div className="mag-reel-track">
          {reel.map((issue, i) => {
            const copy = i >= count;
            return (
              <Link
                key={`${issue.slug}-${i}`}
                href={`/story/${issue.articleSlug}`}
                className="mag-reel-item group"
                aria-label={`${issue.name}: read the feature`}
                tabIndex={copy ? -1 : 0}
                aria-hidden={copy || undefined}
              >
                <span className="mag-reel-cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.cover}
                    alt={`PrimeCrest magazine cover: ${issue.name}`}
                    loading="lazy"
                    draggable={false}
                  />
                  {issue.slug === latest.slug ? <span className="mag-reel-badge">New</span> : null}
                </span>
                <span className="mt-5 block font-sans text-[0.98rem] font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
                  {issue.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
