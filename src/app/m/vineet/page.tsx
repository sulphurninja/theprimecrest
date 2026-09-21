import { HtmlFlipbook } from "@/components/reader/HtmlFlipbook";
import { VineetPages, VINEET_TOC } from "@/content/VineetPages";
import { issueMetadata, IssueJsonLdScript } from "@/lib/issue-seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const SEO = {
  title: "Top 10 Unstoppable Business Leaders Making a Difference in 2026 — Vineet Trakroo",
  description:
    "Vineet Trakroo — CEO & Chief Evolution Officer, Evolution Strategy Advisors LLP. Growth strategy, execution, and building sustainable business, told in PrimeCrest's Evolution Issue.",
  slug: "vineet",
  ogImage: `${SITE_URL}/issues/vineet/og.jpg`,
  kicker: "PrimeCrest · Vol. III · The Evolution Issue",
};

export const metadata = issueMetadata(SEO);

export default function VineetIssuePage() {
  return (
    <>
      <IssueJsonLdScript input={SEO} />
      <HtmlFlipbook title="PrimeCrest — The Evolution Issue" toc={VINEET_TOC}>
        <VineetPages />
      </HtmlFlipbook>
    </>
  );
}
