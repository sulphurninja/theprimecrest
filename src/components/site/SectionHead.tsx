import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Magazine section header: a spaced label over an uppercase serif title,
 * an optional description beside it, and "View all" behind a rule.
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
    <div className="mb-10 grid grid-cols-1 items-center gap-x-10 gap-y-5 lg:grid-cols-12">
      <div className={cn(dek ? "lg:col-span-5" : href ? "lg:col-span-10" : "lg:col-span-12")}>
        {eyebrow ? (
          <p className={cn("label !tracking-[0.28em]", dark ? "text-white/70" : "text-ink")}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            "display-caps text-[2.3rem] sm:text-[3rem]",
            eyebrow && "mt-3",
            dark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>
      {dek ? (
        <p
          className={cn(
            "text-[1rem] leading-[1.75] lg:col-span-5",
            dark ? "text-white/70" : "text-ink-soft",
          )}
        >
          {dek}
        </p>
      ) : null}
      {href ? (
        <div
          className={cn(
            "flex lg:col-span-2 lg:h-full lg:items-center lg:justify-center lg:border-l",
            dark ? "lg:border-white/40" : "lg:border-ink",
          )}
        >
          <Link href={href} className={cn("read-more", dark ? "text-white" : "text-ink")}>
            {linkLabel} »
          </Link>
        </div>
      ) : null}
    </div>
  );
}
