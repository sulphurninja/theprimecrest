import { Suspense } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { InitialLoader } from "@/components/site/InitialLoader";
import { MarketStrip } from "@/components/site/MarketStrip";
import { getNavCategories, getSettings } from "@/lib/queries";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, categories] = await Promise.all([getSettings(), getNavCategories()]).catch(
    () => [null, [] as Awaited<ReturnType<typeof getNavCategories>>] as const,
  );

  const name = settings?.siteName || "PrimeCrest";
  const tagline = settings?.tagline || "A journal of affairs, business, and culture.";
  const cats = (categories || []).map((c: { name: string; slug: string }) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <InitialLoader>
      <SiteHeader
        siteName={name}
        tagline={tagline}
        issueLabel={settings?.issueLabel || "Vol. IV · No. 33"}
        ticker={settings?.ticker}
        categories={cats}
      />
      <Suspense fallback={null}>
        <MarketStrip />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteName={name}
        blurb={
          settings?.footerBlurb ||
          "PrimeCrest publishes considered journalism on power, capital, culture, and the people who shape them."
        }
        copyright={settings?.copyright || "PrimeCrest Media Ltd."}
        categories={cats}
      />
    </InitialLoader>
  );
}
