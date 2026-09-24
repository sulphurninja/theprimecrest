import Link from "next/link";
import { MAGAZINE_ISSUES } from "@/lib/magazines";

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
    volume: issue?.volume || "",
    role: issue?.role || "",
  };
}

export function MagazineCoverGrid({ items }: { items: MagazineShelfItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const meta = magazineShelfMeta(item);
        return (
          <article key={item._id} className="flex flex-col">
            <div className="magazine-3d mx-auto w-full max-w-[210px]">
              <Link
                href={`/story/${item.slug}`}
                className="magazine-cover relative block aspect-[3/4] overflow-hidden"
                aria-label={`${meta.name} — read the feature`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.cover}
                  alt={`PrimeCrest ${meta.volume} — ${meta.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Link>
            </div>
            {meta.volume ? (
              <p className="mt-5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent">
                {meta.volume}
              </p>
            ) : null}
            <h2 className="headline mt-1.5 text-[1.15rem] leading-snug">
              <Link href={`/story/${item.slug}`} className="no-underline hover:text-accent">
                {meta.name}
              </Link>
            </h2>
            {meta.role ? (
              <p className="mt-1 font-sans text-[0.82rem] text-muted">{meta.role}</p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
