import Link from "next/link";
import { ArrowIcon } from "@/components/site/Icons";
import { cn } from "@/lib/utils";

/**
 * Section header: a serif title, a thin gold rule running across, and an
 * optional gold "View all" link. An optional line of description sits below.
 */
export function SectionTitle({
  title,
  eyebrow,
  dek,
  href,
  linkLabel = "View all",
  dark = false,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  dek?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-7">
      {eyebrow ? (
        <p className={cn("label mb-1.5", dark ? "text-gold-soft" : "text-gold-deep")}>{eyebrow}</p>
      ) : null}
      <div className="flex items-center gap-5">
        <h2
          className={cn(
            "shrink-0 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] sm:text-[2rem]",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        <span className={cn("h-px flex-1", dark ? "bg-gold-soft/50" : "bg-gold/60")} aria-hidden />
        {href ? (
          <Link
            href={href}
            className={cn(
              "group inline-flex shrink-0 items-center gap-1.5 font-sans text-[0.84rem] font-semibold no-underline transition-colors",
              dark ? "text-gold-soft hover:text-white" : "text-gold-deep hover:text-ink",
            )}
          >
            {linkLabel}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
      {dek ? (
        <p className={cn("mt-3 max-w-2xl text-[0.98rem] leading-relaxed", dark ? "text-white/70" : "text-ink-soft")}>
          {dek}
        </p>
      ) : null}
    </div>
  );
}
