import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms for reading PrimeCrest, using the digital magazine, and sharing our work.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-16 lg:px-8">
      <header className="border-b-2 border-ink pb-8">
        <p className="kicker">The Journal</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Terms of Use</h1>
        <p className="dek mt-4">
          The rules for reading the journal, the digital magazine, and everything we publish around them.
        </p>
        <p className="meta mt-4">Effective 16 October 2026</p>
      </header>

      <div className="space-y-10 py-12 font-serif text-[1.05rem] leading-relaxed text-ink-soft">
        <p>
          These terms cover theprimecrest.com and magazines.theprimecrest.com,
          both published by {SITE.company}. By using either site you agree to
          them. If you do not, please leave the page.
        </p>

        <section>
          <h2 className="section-title mb-3 text-ink">The work</h2>
          <p>
            Stories, photographs, magazine pages, and the PrimeCrest name and
            crest belong to {SITE.company} or to the people who licensed them to
            us. You may read them, share a link, and quote a short passage with
            credit and a link back. You may not copy an issue, a feature, or our
            marks for your own publication, product, or advertisement without
            written permission.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">The magazine</h2>
          <p>
            The digital magazine is for personal reading. Downloading a page to
            keep, reprint, or resell is not allowed. The flipbook is part of the
            issue, not a file we are giving away.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">What we publish</h2>
          <p>
            Features are journalism. They are not investment, legal, or medical
            advice. Advertising and sponsored work are marked as such. We correct
            errors when we learn of them. Write to the desk through{" "}
            <Link href="/contact" className="text-accent no-underline hover:text-accent-hover">
              Contact Us
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">Your messages</h2>
          <p>
            If you send a tip, a letter, or a pitch, you confirm it is yours to
            send. We may use a letter in correspondence with you. We will not
            publish your message without asking. The{" "}
            <Link href="/privacy" className="text-accent no-underline hover:text-accent-hover">
              Privacy Policy
            </Link>{" "}
            explains what we keep.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">The site itself</h2>
          <p>
            We work to keep PrimeCrest available and accurate. We do not promise
            that every page will be up, uninterrupted, or free of mistakes. To
            the extent the law allows, {SITE.company} is not liable for loss
            that comes from using the site or relying on a story as professional
            advice.
          </p>
          <p className="mt-4">
            These terms are governed by the laws of the State of Wyoming. Questions
            go to{" "}
            <a href={`mailto:${SITE.email}`} className="text-accent no-underline hover:text-accent-hover">
              {SITE.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
