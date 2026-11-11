import Link from "next/link";
import { LATEST_ISSUE, MAGAZINE_ISSUES, issueLabel } from "@/lib/magazines";

export type MagazineShelfItem = {
  _id: string;
  slug: string;
  title: string;
  magazineCover?: string;
  ogImage?: string;
  coverImage?: string;
};

export function magazineShelfMeta(item: MagazineShelfItem) {
  const issue = MAGAZINE_ISSUES.find((entry) => entry.articleSlug === item.slug);
  const cover = item.magazineCover || issue?.cover || item.ogImage || item.coverImage || "";
  const name = issue?.name || item.title.split(":")[0]?.trim() || item.title;
  return {
    cover,
    name,
    label: issue ? issueLabel(issue) : "",
    role: issue?.role || "",
    title: issue?.title || "",
    latest: issue?.slug === LATEST_ISSUE.slug,
  };
}

/** Shelf of magazine covers. Callers pass items newest first. */
export function MagazineCoverGrid({
  items,
  dark = false,
  columns = 4,
}: {
  items: MagazineShelfItem[];
  dark?: boolean;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:gap-x-10 ${
        columns === 4 ? "lg:grid-cols-4" : ""
      }`}
    >
      {items.map((item) => {
        const meta = magazineShelfMeta(item);
        return (
          <article key={item._id} className="issue-card group flex flex-col">
            <Link
              href={`/story/${item.slug}`}
              className="issue-cover"
              aria-label={`${meta.name}: read the feature`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.cover} alt={`PrimeCrest ${meta.label}: ${meta.name}`} loading="lazy" />
              {meta.latest ? (
                <span className="absolute left-2.5 top-2.5 z-[1] rounded-full bg-accent px-2.5 py-1 font-sans text-[0.6rem] font-black uppercase tracking-[0.1em] text-white">
                  New
                </span>
              ) : null}
            </Link>
            <h3 className={`headline mt-5 text-[1.15rem] leading-snug ${dark ? "text-paper" : ""}`}>
              <Link href={`/story/${item.slug}`}>{meta.name}</Link>
            </h3>
            {meta.label ? (
              <p className={`mt-0.5 font-sans text-[0.74rem] font-bold ${dark ? "text-gold" : "text-accent"}`}>
                {meta.label}
              </p>
            ) : null}
            {meta.role ? (
              <p className={`mt-1 font-sans text-[0.8rem] leading-snug ${dark ? "text-paper/55" : "text-muted"}`}>
                {meta.role}
              </p>
            ) : null}
            {meta.title ? (
              <p className={`mt-2 font-serif text-[0.92rem] italic leading-snug ${dark ? "text-paper/70" : "text-ink-soft"}`}>
                {meta.title}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
