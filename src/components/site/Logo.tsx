import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * PrimeCrest wordmark. The terminal period in accent red is the brand mark —
 * a full stop, the editorial gesture of a finished sentence.
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
    <span className={cn("wordmark inline-block whitespace-nowrap", className)}>
      {name}
      <span className="text-accent">.</span>
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} className="no-underline">
      {mark}
    </Link>
  );
}

/** Compact "P." monogram used for avatars, favicons, and tight spaces. */
export function Monogram({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span
      className={cn(
        "wordmark inline-flex select-none items-center justify-center bg-ink text-paper",
        className,
      )}
      aria-hidden
    >
      <span className="text-[0.62em] leading-none">
        P<span className="text-accent">.</span>
      </span>
    </span>
  );
}
