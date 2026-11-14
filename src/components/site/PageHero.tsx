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
    <header className="border-b border-ink">
      <div
        className={cn(
          "mx-auto px-4 pb-12 pt-14 sm:px-6 lg:pb-14 lg:pt-20",
          narrow ? "max-w-[808px]" : "max-w-[1320px]",
        )}
      >
        {eyebrow ? <p className="label !tracking-[0.28em] text-ink">{eyebrow}</p> : null}
        <h1
          className={cn(
            "display-caps mt-4",
            narrow
              ? "text-[2.6rem] sm:text-[3.4rem]"
              : "max-w-5xl text-[2.8rem] sm:text-[3.8rem] lg:text-[4.6rem]",
          )}
        >
          {title}
        </h1>
        {dek ? (
          <p className="mt-6 max-w-2xl text-[1.08rem] leading-[1.75] text-ink-soft">{dek}</p>
        ) : null}
        {meta ? <p className="mt-4 font-sans text-[0.8rem] text-muted">{meta}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
