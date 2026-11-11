import { cn } from "@/lib/utils";

/**
 * Page masthead for inner pages: label, large title, standfirst and optional
 * actions. `narrow` lines it up with a single reading column below.
 */
export function PageHero({
  eyebrow,
  title,
  dek,
  meta,
  narrow = false,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  dek?: React.ReactNode;
  meta?: React.ReactNode;
  narrow?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-ink/10">
      <div
        className={cn(
          "mx-auto px-4 pb-12 pt-14 sm:px-6 lg:pb-14 lg:pt-20",
          narrow ? "max-w-[808px]" : "max-w-[1320px]",
        )}
      >
        {eyebrow ? <p className="label text-accent">{eyebrow}</p> : null}
        <h1
          className={cn(
            "statement mt-3",
            narrow
              ? "text-[2.5rem] sm:text-[3.2rem]"
              : "max-w-4xl text-[2.6rem] sm:text-[3.6rem] lg:text-[4.4rem]",
          )}
        >
          {title}
        </h1>
        {dek ? (
          <p className="mt-5 max-w-2xl font-serif text-[1.15rem] leading-relaxed text-ink-soft">{dek}</p>
        ) : null}
        {meta ? <p className="mt-4 font-sans text-[0.8rem] text-muted">{meta}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
