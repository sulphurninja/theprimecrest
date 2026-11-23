import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CREST_LOWER,
  CREST_UPPER,
  CREST_VIEWBOX,
  FULL_STOP,
  LETTERS_CREST,
  LETTERS_PRIME,
  LOGO_VIEWBOX,
} from "@/components/site/logo-paths";

/**
 * The PrimeCrest masthead, as printed on the magazine covers: the double
 * chevron crest beside PRIMECREST in tracked Cinzel capitals, with a red
 * full stop. "PRIME" and the upper chevron take the current text colour, so
 * the logo reads in ink on light pages and white on dark ones; "CREST" and
 * the lower chevron are gold. Size it with
 * font-size; the logo's cap height is 0.62em.
 */
export const TAGLINE = "Where Vision Meets Voice";

const GOLD = "#c39a4b";

export function Wordmark({
  name = "PrimeCrest",
  className = "",
  href = "/",
  showTagline = false,
}: {
  name?: string;
  className?: string;
  href?: string | null;
  showTagline?: boolean;
}) {
  const mark = (
    <span className={cn("inline-flex flex-col", className)}>
      <svg
        viewBox={LOGO_VIEWBOX}
        role="img"
        aria-label={name}
        className="block h-[0.66em] w-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={CREST_UPPER} fill="currentColor" />
        <path d={CREST_LOWER} fill={GOLD} />
        <path d={LETTERS_PRIME} fill="currentColor" />
        <path d={LETTERS_CREST} fill={GOLD} />
        <path d={FULL_STOP} fill="var(--red)" />
      </svg>
      {showTagline && (
        <span className="mt-[0.42em] whitespace-nowrap text-center font-sans text-[0.26em] font-semibold uppercase tracking-[0.42em] opacity-55">
          {TAGLINE}
        </span>
      )}
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} className="no-underline" aria-label={`${name} home`}>
      {mark}
    </Link>
  );
}

/** The crest on its own: two chevrons, the lower one in gold. */
export function CrestIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={CREST_VIEWBOX} className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <path d={CREST_UPPER} fill="currentColor" />
      <path d={CREST_LOWER} fill={GOLD} />
    </svg>
  );
}

/** Square crest monogram for avatars, favicons and tight spaces. */
export function Monogram({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center bg-brand text-[#f7f2e8]",
        className,
      )}
      aria-hidden
    >
      <CrestIcon className="h-[52%] w-auto" />
    </span>
  );
}
