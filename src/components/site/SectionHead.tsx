import Link from "next/link";
import { ArrowIcon } from "@/components/site/Icons";

/** Section title with a hairline running to an optional "see all" link. */
export function SectionTitle({
  title,
  eyebrow,
  href,
  linkLabel = "See all",
  dark = false,
}: {
  title: React.ReactNode;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p
          className={`mb-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-gold-soft" : "text-accent"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <div className="flex items-center gap-6">
        <h2 className={`statement shrink-0 text-[1.8rem] sm:text-[2.2rem] ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
        <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-ink/15"}`} aria-hidden />
        {href ? (
          <Link
            href={href}
            className={`group inline-flex shrink-0 items-center gap-2 font-sans text-[0.82rem] font-semibold no-underline transition-colors ${
              dark ? "text-white/80 hover:text-white" : "text-ink hover:text-accent"
            }`}
          >
            {linkLabel}
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
