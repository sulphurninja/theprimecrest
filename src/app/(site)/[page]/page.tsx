import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleBody } from "@/components/site/ArticleBody";
import { getPageBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RESERVED_PATHS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

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
    <div className="mx-auto max-w-[760px] px-5 py-8 lg:px-8">
      {/* Back link */}
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-2 font-sans text-[0.8rem] font-medium text-muted no-underline transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to PrimeCrest
      </Link>

      <article className="animate-in">
        <header className="border-b border-rule pb-10">
          <p className="kicker mb-3">The Journal</p>
          <h1 className="headline text-[2.2rem] sm:text-[2.8rem]">{page.title}</h1>
          {page.excerpt ? (
            <p className="dek mt-4 text-[1.1rem]">{page.excerpt}</p>
          ) : null}
        </header>

        <div className="py-10">
          <ArticleBody html={page.content} />
        </div>

        {/* Footer links */}
        <footer className="border-t border-rule pt-8">
          <p className="mb-4 font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted">
            More from The Journal
          </p>
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
      </article>
    </div>
  );
}
