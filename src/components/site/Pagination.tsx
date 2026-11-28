import Link from "next/link";
import { ArrowBackIcon, ArrowIcon } from "@/components/site/Icons";
import { cn } from "@/lib/utils";

/** Page numbers to show: first, last, and a window around the current page. */
function pageList(page: number, total: number): (number | "gap")[] {
  const keep = new Set([1, total, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (page >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => keep.add(n));
  const pages = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/**
 * Numbered pagination: ← 1 2 3 … 9 →. `href(n)` builds the link for page n;
 * page 1 should be the clean URL (no ?page=1).
 */
export function Pagination({
  page,
  totalPages,
  href,
  className,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;
  const box =
    "flex h-10 min-w-10 items-center justify-center border px-3 font-sans text-[0.86rem] font-semibold no-underline transition-colors";
  const idle = "border-ink/15 bg-surface text-ink hover:border-ink hover:bg-ink hover:text-white";
  const off = "pointer-events-none border-ink/10 text-ink/30";

  return (
    <nav aria-label="Pagination" className={cn("flex flex-col items-center gap-3 py-10", className)}>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 ? (
          <Link href={href(page - 1)} rel="prev" aria-label="Previous page" className={cn(box, idle)}>
            <ArrowBackIcon className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span aria-hidden className={cn(box, off)}>
            <ArrowBackIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {pageList(page, totalPages).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} aria-hidden className="px-1.5 font-sans text-[0.86rem] text-muted">
              …
            </span>
          ) : n === page ? (
            <span key={n} aria-current="page" className={cn(box, "border-brand bg-brand text-white")}>
              {n}
            </span>
          ) : (
            <Link key={n} href={href(n)} aria-label={`Page ${n}`} className={cn(box, idle)}>
              {n}
            </Link>
          ),
        )}
        {page < totalPages ? (
          <Link href={href(page + 1)} rel="next" aria-label="Next page" className={cn(box, idle)}>
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span aria-hidden className={cn(box, off)}>
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <p className="font-sans text-[0.75rem] font-medium uppercase tracking-[0.14em] text-muted">
        Page {page} of {totalPages}
      </p>
    </nav>
  );
}
