import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { MAGAZINE_ISSUES } from "@/lib/magazines";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "The Digital Magazine",
  description:
    "The PrimeCrest digital magazine — The September Issue, 2026. Five covers, five leaders, each with a feature story and a full flipbook edition.",
  path: "/magazine",
});

export default function MagazinePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8">
      <header className="mx-auto max-w-[760px] text-center">
        <p className="kicker">The September Issue · 2026</p>
        <h1 className="headline mt-4 text-[2.4rem] sm:text-[3.2rem]">
          The Digital Magazine
        </h1>
        <p className="dek mx-auto mt-5 max-w-xl text-[1.15rem]">
          Five covers, five leaders. Read the feature story here, or open the
          full flipbook edition — designed page by page, like print.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {MAGAZINE_ISSUES.map((issue) => (
          <article key={issue.slug} className="flex flex-col">
            <div className="magazine-3d mx-auto w-full max-w-[210px]">
              <Link
                href={`/story/${issue.articleSlug}`}
                className="magazine-cover relative block aspect-[3/4] overflow-hidden"
                aria-label={`${issue.name} — read the feature article`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.cover}
                  alt={`PrimeCrest ${issue.volume} — ${issue.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </Link>
            </div>
            <p className="mt-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
              {issue.volume} · 2026
            </p>
            <h2 className="headline mt-1.5 text-[1.15rem] leading-snug">
              <Link href={`/story/${issue.articleSlug}`} className="no-underline hover:text-accent">
                {issue.name}
              </Link>
            </h2>
            <p className="mt-1 font-sans text-[0.82rem] text-muted">{issue.role}</p>
            <p className="mt-2 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
              {issue.title}.
            </p>
            <div className="mt-4 flex items-center gap-4 border-t border-rule pt-4">
              <Link
                href={`/story/${issue.articleSlug}`}
                className="font-sans text-[0.8rem] font-semibold text-ink no-underline transition-colors hover:text-accent"
              >
                Read the story →
              </Link>
              <a
                href={issue.magazineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[0.8rem] font-semibold text-muted no-underline transition-colors hover:text-accent"
              >
                Open the magazine ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
