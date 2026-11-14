import Link from "next/link";
import { ArrowIcon, IssueIcon } from "@/components/site/Icons";
import { buildMetadata } from "@/lib/seo";
import { ISSUES_NEWEST_FIRST, LATEST_ISSUE, issueLabel, issueMonth, type MagazineIssue } from "@/lib/magazines";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "The Digital Magazine",
  description:
    "The PrimeCrest digital magazine. Each cover has a feature story and a full flipbook edition.",
  path: "/magazine",
});

/** Issues grouped by month, newest month first, keeping newest-first order inside each. */
function byMonth(issues: MagazineIssue[]) {
  const groups: { month: string; issues: MagazineIssue[] }[] = [];
  for (const issue of issues) {
    const month = issueMonth(issue.issue);
    const group = groups.find((g) => g.month === month);
    if (group) group.issues.push(issue);
    else groups.push({ month, issues: [issue] });
  }
  return groups;
}

export default function MagazinePage() {
  const latest = LATEST_ISSUE;

  return (
    <div>
      {/* Latest issue */}
      <section className="border-b border-ink/10 bg-paper-2">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:items-center lg:py-24">
          <div className="lg:col-span-7">
            <p className="label text-accent">
              The digital magazine · This month&apos;s cover
            </p>
            <h1 className="display-caps mt-5 text-[3rem] sm:text-[4.2rem] lg:text-[5rem]">
              {latest.name}
            </h1>
            <p className="mt-3 text-[1rem] text-muted">
              {latest.role} · {issueLabel(latest)}
            </p>
            <p className="mt-7 max-w-lg font-serif text-[1.45rem] italic leading-snug text-ink-soft">
              {latest.title}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={`/story/${latest.articleSlug}`}
                className="group btn-primary"
              >
                Read the feature
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={latest.magazineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <IssueIcon className="h-4 w-4" /> Open the flipbook
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Link
              href={`/story/${latest.articleSlug}`}
              className="issue-card group mx-auto block w-full max-w-[340px]"
              aria-label={`${latest.name}: read the feature`}
            >
              <span className="issue-cover !shadow-[0_50px_90px_-36px_rgba(14,14,16,0.7)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={latest.cover} alt={`PrimeCrest ${issueLabel(latest)}: ${latest.name}`} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Archive, by month */}
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6">
        {byMonth(ISSUES_NEWEST_FIRST).map((group) => (
          <section key={group.month} className="mb-20 last:mb-0">
            <div className="mb-10 flex items-center gap-6">
              <h2 className="statement shrink-0 text-[1.8rem] sm:text-[2.2rem]">{group.month}</h2>
              <span className="h-px flex-1 bg-ink/15" aria-hidden />
              <span className="shrink-0 font-sans text-[0.82rem] text-muted">
                {group.issues.length} {group.issues.length === 1 ? "edition" : "editions"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
              {group.issues.map((issue) => (
                <article key={issue.slug} className="issue-card group flex flex-col">
                  <Link
                    href={`/story/${issue.articleSlug}`}
                    className="issue-cover"
                    aria-label={`${issue.name}: read the feature article`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={issue.cover}
                      alt={`PrimeCrest ${issueLabel(issue)}: ${issue.name}`}
                      loading="lazy"
                    />
                  </Link>
                  <h3 className="headline mt-5 text-[1.12rem] leading-snug">
                    <Link href={`/story/${issue.articleSlug}`}>{issue.name}</Link>
                  </h3>
                  <p className="mt-1 text-[0.8rem] leading-snug text-muted">{issue.role}</p>
                  <p className="mt-2 font-serif text-[0.95rem] italic leading-snug text-ink-soft">
                    {issue.title}
                  </p>
                  <div className="mt-auto flex items-center gap-5 pt-4">
                    <Link
                      href={`/story/${issue.articleSlug}`}
                      className="nav-link font-sans text-[0.8rem] font-semibold text-ink"
                    >
                      Read the feature
                    </Link>
                    <a
                      href={issue.magazineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link font-sans text-[0.8rem] font-semibold text-muted transition-colors hover:text-ink"
                    >
                      Flipbook
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
