import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "PrimeCrest is an international business magazine published by Fortiora Group LLC: cover stories, interviews and a monthly digital edition.",
  path: "/about",
});

const PUBLISH = [
  {
    title: "Cover stories",
    body: "In-depth profiles of the leaders, founders and educators redefining their fields, each with its own magazine cover.",
  },
  {
    title: "Interviews",
    body: "Conversations with executives and decision-makers on strategy, leadership and the choices behind their work.",
  },
  {
    title: "The digital magazine",
    body: "Every edition designed page by page and published as a flipbook, with each feature also available to read here.",
  },
  {
    title: "Women in Business",
    body: "A dedicated series on the women building companies, institutions and careers on their own terms.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About PrimeCrest"
        title="About us"
        dek={SITE.tagline}
        narrow
      />
      <div className="mx-auto max-w-[808px] px-4 sm:px-6">
        <div className="space-y-12 py-14 font-serif text-[1.08rem] leading-[1.8] text-ink-soft">
          <p>
            PrimeCrest is an international business magazine. We profile the leaders, founders and
            innovators shaping their industries, from boardrooms and new ventures to classrooms and
            public institutions, and publish their stories as cover features, interviews and a
            monthly digital edition.
          </p>

          <section>
            <h2 className="display-caps mb-6 text-[1.9rem] text-ink">What we publish</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {PUBLISH.map((item) => (
                <div key={item.title} className="border-t border-ink pt-4">
                  <h3 className="font-sans text-[1rem] font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[1rem] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8">
              <Link href="/magazine" className="read-more text-ink">
                Browse every edition »
              </Link>
            </p>
          </section>

          <section>
            <h2 className="display-caps mb-4 text-[1.9rem] text-ink">Our standards</h2>
            <p>
              Every story is reported, written and edited before it is published. Sponsored content
              is always labelled as such, and advertising never decides who appears on our cover.
            </p>
          </section>

          <section>
            <h2 className="display-caps mb-4 text-[1.9rem] text-ink">The publisher</h2>
            <p>PrimeCrest is published by {SITE.company}.</p>
            <address className="mt-3 not-italic">
              {SITE.address.street}
              <br />
              {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
            </address>
            <p className="mt-3">
              <a
                href={`mailto:${SITE.email}`}
                className="font-sans text-[0.95rem] font-semibold text-ink no-underline hover:text-accent"
              >
                {SITE.email}
              </a>
            </p>
            <p className="mt-4">
              For story tips, corrections or a letter to the editors, please{" "}
              <Link href="/contact" className="text-ink underline decoration-accent underline-offset-4 hover:text-accent">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
