import { HtmlFlipbook } from "@/components/reader/HtmlFlipbook";
import { KohilaPages, KOHILA_TOC } from "@/content/KohilaPages";
import { issueMetadata, IssueJsonLdScript } from "@/lib/issue-seo";
import { siteUrl } from "@/lib/utils";

const SEO = {
  title: "Top 10 Unstoppable Business Leaders Making a Difference in 2026 — Kohila Sivas",
  description:
    "Kohila Sivas — Founder & Master Coach, Wholistic SuccessCodes™. Two decades transforming how humans learn, live, and lead, told in PrimeCrest's Readiness Issue.",
  slug: "kohila",
  ogImage: siteUrl("/issues/kohila/og.jpg"),
  kicker: "PrimeCrest · Vol. III · The Readiness Issue",
};

export const metadata = issueMetadata(SEO);

export default function KohilaIssuePage() {
  return (
    <>
      <IssueJsonLdScript input={SEO} />
      <HtmlFlipbook title="PrimeCrest — The Readiness Issue" toc={KOHILA_TOC}>
        <KohilaPages />
      </HtmlFlipbook>
    </>
  );
}
