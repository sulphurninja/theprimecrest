import Link from "next/link";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How PrimeCrest collects, uses, and keeps the information you send us, including the newsletter and contact forms.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-16 lg:px-8">
      <header className="border-b-2 border-ink pb-8">
        <p className="kicker">The Journal</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Privacy Policy</h1>
        <p className="dek mt-4">
          What we collect when you read PrimeCrest, write to the desk, or join the Morning Letter.
        </p>
        <p className="meta mt-4">Effective 16 October 2026</p>
      </header>

      <div className="space-y-10 py-12 font-serif text-[1.05rem] leading-relaxed text-ink-soft">
        <p>
          PrimeCrest is published by {SITE.company}, {SITE.address.street},{" "}
          {SITE.address.city}, {SITE.address.state} {SITE.address.zip}. This
          policy covers theprimecrest.com and the digital magazine at
          magazines.theprimecrest.com.
        </p>

        <section>
          <h2 className="section-title mb-3 text-ink">What you send us</h2>
          <p>
            If you join the newsletter, we store the email address you submit so
            we can send the Morning Letter. If you use the contact or advertising
            forms, we store your name, email, and the message so the desk can
            reply. We do not sell that list.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">What the site records</h2>
          <p>
            Like most publishers, the site and our host keep ordinary server
            logs: the page requested, a rough time, and the browser that asked
            for it. The staff login uses a session cookie that expires. Readers
            do not need an account to read a story.
          </p>
          <p className="mt-4">
            Advertising on the site is served from campaigns we place ourselves.
            A click leaves PrimeCrest for the advertiser&apos;s own site, which
            has its own policy.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">How long we keep it</h2>
          <p>
            Newsletter addresses stay on the list until you ask to be removed.
            Messages to the desk are kept long enough to answer them and to keep
            a record of corrections. Write to{" "}
            <a href={`mailto:${SITE.email}`} className="text-accent no-underline hover:text-accent-hover">
              {SITE.email}
            </a>{" "}
            to correct or delete what we hold about you.
          </p>
        </section>

        <section>
          <h2 className="section-title mb-3 text-ink">Questions</h2>
          <p>
            Privacy questions go to the same address, or through{" "}
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
