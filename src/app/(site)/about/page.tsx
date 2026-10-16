import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "PrimeCrest is a journal of affairs, business, and culture, published by Fortiora Group LLC. Features, interviews, and a digital magazine.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-16 lg:px-8">
      <header className="border-b-2 border-ink pb-8">
        <p className="kicker">The Journal</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">About Us</h1>
        <p className="dek mt-4">{SITE.slogan}</p>
      </header>

      <div className="space-y-10 py-12 font-serif text-[1.05rem] leading-relaxed text-ink-soft">
        <p>
          PrimeCrest is a journal of affairs, business, and culture. We publish
          features and interviews with the people building companies, classrooms,
          and institutions, and we bind the longer ones into a digital magazine
          you can read page by page.
        </p>
        <p>
          The desk is independent. Stories are reported and edited before they
          run. Advertising is labeled, and it does not decide what goes on the
          cover.
        </p>

        <section>
          <h2 className="section-title mb-3 text-ink">What we publish</h2>
          <p>
            Section fronts for affairs, business, and women in business. A
            homepage built around the current issue. And the magazine itself,
            each cover tied to a feature you can open from the story.
          </p>
          <p className="mt-4">
            <Link href="/magazine" className="font-sans text-[0.9rem] font-semibold text-accent no-underline hover:text-accent-hover">
              The digital magazine →
            </Link>
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">The publisher</h2>
          <p>
            PrimeCrest is published by {SITE.company}.
          </p>
          <address className="mt-3 not-italic">
            {SITE.address.street}
            <br />
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </address>
          <p className="mt-3">
            <a
              href={`mailto:${SITE.email}`}
              className="font-sans text-[0.9rem] font-semibold text-accent no-underline hover:text-accent-hover"
            >
              {SITE.email}
            </a>
          </p>
          <p className="mt-4">
            For a tip, a correction, or a letter to the desk, use{" "}
            <Link href="/contact" className="text-accent no-underline hover:text-accent-hover">
              Contact Us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
