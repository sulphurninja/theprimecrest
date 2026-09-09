import Link from "next/link";

/** Shared coming-soon plate for the digital magazine. */
export function MagazineComingSoonCover({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-br from-ink via-[#1a1814] to-[#0c0b0a] px-5 py-7 text-center ${className}`}
    >
      <span className="font-sans text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-paper/45">
        PrimeCrest
      </span>
      <span className="flex flex-col items-center gap-3">
        <span className="h-px w-8 bg-accent/80" />
        <span className="headline text-[1.35rem] leading-[1.15] text-paper">
          Coming
          <br />
          Soon
        </span>
        <span className="h-px w-8 bg-accent/80" />
      </span>
      <span className="font-sans text-[0.58rem] uppercase tracking-[0.18em] text-paper/40">
        The Journal
      </span>
    </span>
  );
}

export function MagazineComingSoonPage() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 text-center lg:px-8">
      <p className="kicker">The Journal</p>
      <h1 className="headline mt-3 text-[2.6rem] sm:text-[3.4rem]">Magazine</h1>
      <p className="dek mx-auto mt-5 max-w-xl">
        The digital edition is on the press. Features, long reads, and the next cover will
        land here — not yet.
      </p>

      <div className="magazine-3d mx-auto mt-12 w-[200px]">
        <div className="magazine-cover relative aspect-[3/4] overflow-hidden shadow-2xl">
          <MagazineComingSoonCover />
        </div>
      </div>

      <p className="mt-10 font-serif text-[1.05rem] text-ink-soft">
        Coming soon.
      </p>
      <p className="mt-3 font-sans text-[0.85rem] text-muted">
        In the meantime, the daily briefing is live.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center border border-ink px-6 py-3 font-sans text-[0.82rem] font-semibold text-ink no-underline transition-colors hover:bg-ink hover:text-paper"
      >
        Back to the front page
      </Link>
    </div>
  );
}
