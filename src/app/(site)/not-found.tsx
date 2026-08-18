import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-32 text-center">
      <p className="kicker">Error 404</p>
      <h1 className="headline mt-4 text-[2.6rem] sm:text-[3.2rem]">
        This page went to print without us.
      </h1>
      <p className="mt-5 font-serif text-ink-soft">
        The story you&apos;re looking for may have moved, or it never existed. The archive,
        however, is deep.
      </p>
      <div className="mt-9 flex items-center justify-center gap-4">
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
