import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * PrimeCrest wordmark with integrated crest mark above the P.
 */
export function Wordmark({
  name = "PrimeCrest",
  className = "",
  href = "/",
}: {
  name?: string;
  className?: string;
  href?: string | null;
}) {
  const mark = (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", className)}>
      <CrestIcon className="h-[0.85em] w-auto" />
      <span className="wordmark">
        {name}
        <span className="text-accent">.</span>
      </span>
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} className="no-underline">
      {mark}
    </Link>
  );
}

/** Crest icon — angular peak/chevron mark */
function CrestIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 2L28 16H22L16 8.5L10 16H4L16 2Z"
        fill="currentColor"
      />
      <path
        d="M16 12L24 22H20L16 16.5L12 22H8L16 12Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

/** Compact "P." monogram used for avatars, favicons, and tight spaces. */
export function Monogram({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center justify-center bg-ink text-paper",
        className,
      )}
      aria-hidden
    >
      <CrestIcon className="h-[0.5em] w-auto" />
    </span>
  );
}
