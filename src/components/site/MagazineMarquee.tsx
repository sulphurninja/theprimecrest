import Link from "next/link";
import { MAGAZINE_ISSUES } from "@/lib/magazines";

/**
 * 3D showcase marquee of the digital magazine covers.
 * Covers scroll continuously; each links to its feature article.
 */
export function MagazineMarquee() {
  // Two copies back-to-back make the loop seamless.
  const reel = [...MAGAZINE_ISSUES, ...MAGAZINE_ISSUES];

  return (
    <section className="mag-marquee-band -mx-5 lg:-mx-8" aria-label="Digital magazine issues">
      <div className="mx-auto max-w-[1280px] px-5 pt-12 lg:px-8">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#c39a4b]">
              The September Issue · 2026
            </p>
            <h2 className="headline mt-2 text-[1.7rem] text-paper sm:text-[2.1rem]">
              The Digital Magazines
            </h2>
          </div>
          <Link
            href="/magazine"
            className="hidden shrink-0 font-sans text-[0.8rem] font-medium text-paper/60 no-underline transition-colors hover:text-paper sm:block"
          >
            All issues →
          </Link>
        </div>
      </div>

      <div className="mag-marquee mt-10 pb-14">
        <div className="mag-marquee-track">
          {reel.map((issue, i) => (
            <Link
              key={`${issue.slug}-${i}`}
              href={`/story/${issue.articleSlug}`}
              className="mag-marquee-item group"
              aria-label={`${issue.name} — read the feature article`}
              tabIndex={i < MAGAZINE_ISSUES.length ? 0 : -1}
              aria-hidden={i >= MAGAZINE_ISSUES.length}
            >
              <span className="mag-marquee-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.cover}
                  alt={`PrimeCrest ${issue.volume} — ${issue.name}`}
                  loading="lazy"
                  draggable={false}
                />
                <span className="mag-marquee-spine" aria-hidden />
                <span className="mag-marquee-sheen" aria-hidden />
              </span>
              <span className="mt-4 block text-center">
                <span className="block font-sans text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#c39a4b]">
                  {issue.volume} · 2026
                </span>
                <span className="mt-1 block font-sans text-[0.86rem] font-semibold text-paper transition-colors group-hover:text-[#e5c98c]">
                  {issue.name}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
