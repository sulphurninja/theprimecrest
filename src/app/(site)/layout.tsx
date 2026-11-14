import { Suspense } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { InitialLoader } from "@/components/site/InitialLoader";
import { MarketStrip } from "@/components/site/MarketStrip";
import { WelcomeModal } from "@/components/site/WelcomeModal";
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
    <div className="site-theme flex flex-1 flex-col">
    <InitialLoader>
      <SiteHeader
        siteName={name}
        tagline={tagline}
        issueLabel={settings?.issueLabel || "Vol. IV · No. 33"}
        ticker={settings?.ticker}
        categories={cats}
        socials={settings?.socials}
      />
      <Suspense fallback={null}>
        <MarketStrip />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter
        siteName={name}
        blurb={
          settings?.footerBlurb ||
          "PrimeCrest profiles the leaders, founders and innovators shaping business worldwide, in cover stories, interviews and a monthly digital edition."
        }
        copyright={settings?.copyright || "Fortiora Group LLC."}
        categories={cats}
      />
      <WelcomeModal />
    </InitialLoader>
    </div>
  );
}
