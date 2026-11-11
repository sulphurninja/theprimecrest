/**
 * House icon set. Arrows are tipped with the crest chevron from the
 * PrimeCrest logo, so they read as ours rather than a stock glyph pack.
 * All icons inherit currentColor and size from className.
 */

type IconProps = { className?: string };

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "aria-hidden": true,
} as const;

/** Long hairline arrow with a solid crest-chevron head. */
export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <path d="M2 12h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M22 12l-7.5-6.5v3.6L18.2 12l-3.7 2.9v3.6L22 12z" fill="currentColor" />
    </svg>
  );
}

export function ArrowBackIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className} style={{ transform: "scaleX(-1)" }}>
      <path d="M2 12h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M22 12l-7.5-6.5v3.6L18.2 12l-3.7 2.9v3.6L22 12z" fill="currentColor" />
    </svg>
  );
}

/** Leaves the site: arrow rising out of a corner bracket. */
export function ExternalIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <path d="M4 8v12h12" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 16L19 5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 3l-9.6 1.2 2.6 2.6L11 9.8l3.2 3.2 3-3 2.6 2.6L21 3z" fill="currentColor" />
    </svg>
  );
}

/** Lens with a weighted, angled handle. */
export function SearchIcon({ className = "h-[18px] w-[18px]" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15.4 15.4l5.6 5.6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  );
}

/** Two stacked covers, crest on the front one. */
export function IssueIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <path d="M8 3h11v15" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <rect x="4" y="6" width="12" height="15" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9.5l3.5 4h-1.8L10 11.6l-1.7 1.9H6.5l3.5-4z" fill="currentColor" />
    </svg>
  );
}

/** Folded letter with a crest seal. */
export function LetterIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="5.5" width="18" height="13" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 6l9 7 9-7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 14.5l2.6 3h-1.4L12 16.1l-1.2 1.4H9.4l2.6-3z" fill="currentColor" />
    </svg>
  );
}

/** Rising bars, for the advertise link. */
export function AudienceIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" className={className}>
      <path d="M5 20v-5M10 20v-8M15 20v-11" stroke="currentColor" strokeWidth="2" />
      <path d="M20 3l-3 3.6h1.6V20h2.8V6.6H23L20 3z" fill="currentColor" />
    </svg>
  );
}
