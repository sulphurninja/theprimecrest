import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getMagazineIssues } from "@/lib/queries";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "The Digital Magazine",
  description:
    "The PrimeCrest digital magazine. Each cover has a feature story and a full flipbook edition.",
  path: "/magazine",
});

/** Every edition as a plain cover grid, in the order set in Admin -> Magazines. */
export default async function MagazinePage() {
  const issues = await getMagazineIssues();

  return (
    <div>
      <PageHero eyebrow="The digital magazine" title="Magazines" />

      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {issues.map((issue) => {
            const title = [issue.name, issue.title].filter(Boolean).join(": ");
            return (
              <Link
                key={issue.articleSlug}
                href={`/story/${issue.articleSlug}`}
                className="group flex flex-col no-underline"
              >
                <span className="relative block overflow-hidden bg-paper-2 shadow-[0_14px_30px_-18px_rgba(14,14,16,0.55)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.cover}
                    alt={`PrimeCrest magazine cover: ${issue.name}`}
                    loading="lazy"
                    className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-4 block text-center font-display text-[1.15rem] font-semibold leading-snug text-ink transition-colors group-hover:text-gold-deep">
                  {title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
