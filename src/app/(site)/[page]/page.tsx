import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { ArticleBody } from "@/components/site/ArticleBody";
import { getPageBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RESERVED_PATHS } from "@/lib/constants";

export const revalidate = 300;

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props) {
  const { page: slug } = await params;
  if (RESERVED_PATHS.includes(slug)) return {};
  const page = await getPageBySlug(slug).catch(() => null);
  if (!page) return buildMetadata({ title: "Page not found", noIndex: true });
  return buildMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.excerpt,
    path: `/${page.slug}`,
  });
}

export default async function StaticPage({ params }: Props) {
  const { page: slug } = await params;
  if (RESERVED_PATHS.includes(slug)) notFound();
  const page = await getPageBySlug(slug).catch(() => null);
  if (!page) notFound();

  return (
    <article>
      <PageHero eyebrow="The Journal" title={page.title} dek={page.excerpt || undefined} narrow />
      <div className="mx-auto max-w-[808px] px-4 sm:px-6">
        <div className="py-12">
          <ArticleBody html={page.content} />
        </div>

        {/* Footer links */}
        <footer className="border-t border-ink/10 py-10">
          <p className="label mb-4 text-muted">More from The Journal</p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "About", href: "/about" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ]
              .filter((l) => l.href !== `/${slug}`)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-[0.85rem] font-medium text-ink-soft no-underline transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
          </div>
        </footer>
      </div>
    </article>
  );
}
