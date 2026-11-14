import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-28 text-center sm:py-36">
      <p className="label text-accent">Error 404</p>
      <h1 className="statement mt-4 text-[2.6rem] sm:text-[3.6rem]">
        This page could not be found
      </h1>
      <p className="mx-auto mt-5 max-w-lg font-serif text-[1.08rem] leading-relaxed text-ink-soft">
        It may have moved, or the link may be incorrect. Return to the front page or search the
        archive for the story you need.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to the front page
        </Link>
        <Link href="/search" className="btn-outline">
          Search the archive
        </Link>
      </div>
    </div>
  );
}
