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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {issues.map((issue) => {
            const title = [issue.name, issue.title].filter(Boolean).join(": ");
            return (
              <Link
                key={issue.articleSlug}
                href={`/story/${issue.articleSlug}`}
                className="group flex flex-col border border-ink/20 bg-surface p-3 no-underline transition-colors hover:border-brand"
              >
                <span className="relative block aspect-[3/4] overflow-hidden bg-paper-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={issue.cover}
                    alt={`PrimeCrest magazine cover: ${issue.name}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-4 block px-1 pb-2 font-display text-[1.2rem] font-semibold leading-snug text-ink transition-colors group-hover:text-brand">
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
