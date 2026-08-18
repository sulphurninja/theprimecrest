import Link from "next/link";
import { Search } from "lucide-react";
import { Wordmark } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { formatMastheadDate } from "@/lib/utils";

type NavItem = { name: string; slug: string };

const MAX_VISIBLE_CATEGORIES = 5;

export function SiteHeader({
  siteName,
  tagline,
  ticker,
  categories,
}: {
  siteName: string;
  tagline: string;
  issueLabel?: string;
  ticker?: string;
  categories: NavItem[];
}) {
  const items = categories.map((c) => ({ label: c.name, href: `/c/${c.slug}` }));
  const visibleItems = items.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMore = items.length > MAX_VISIBLE_CATEGORIES;

  return (
    <header className="sticky top-0 z-40 bg-ink text-paper">
      {/* Full-width ticker band — slightly darker for quiet separation */}
      {ticker ? (
        <div className="bg-black/25">
          <div className="mx-auto flex max-w-[1280px] items-center gap-2.5 px-4 py-1.5 sm:px-5 lg:px-8">
            <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="shrink-0 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-paper/90">
              Live
            </span>
            <p className="min-w-0 truncate font-sans text-[0.78rem] text-paper/60">{ticker}</p>
            <span className="ml-auto hidden shrink-0 font-sans text-[0.72rem] text-paper/40 md:block">
              {formatMastheadDate()}
            </span>
          </div>
        </div>
      ) : null}

      {/* Main bar */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-5 lg:px-8">
        <div className="relative flex h-14 items-center justify-between sm:h-16">
          {/* Left — hamburger on mobile, wordmark + nav on desktop */}
          <div className="flex items-center lg:hidden">
            <MobileNav items={items} siteName={siteName} tagline={tagline} dark />
          </div>

          <div className="hidden min-w-0 items-center gap-8 lg:flex">
            <Wordmark name={siteName} className="text-[1.7rem] text-paper" />
            <nav className="flex items-center gap-1" aria-label="Sections">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 font-sans text-[0.875rem] font-medium text-paper/70 no-underline transition-all hover:bg-paper/10 hover:text-paper"
                >
                  {item.label}
                </Link>
              ))}
              {hasMore && (
                <Link
                  href="/search"
                  className="rounded-md px-3 py-1.5 font-sans text-[0.875rem] font-medium text-paper/50 no-underline transition-all hover:bg-paper/10 hover:text-paper"
                >
                  More
                </Link>
              )}
            </nav>
          </div>

          {/* Center — wordmark on mobile only */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
            <Wordmark name={siteName} className="text-[1.45rem] text-paper sm:text-[1.55rem]" />
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-paper/70 transition-all hover:bg-paper/10 hover:text-paper"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </Link>
            <Link
              href="/newsletter"
              className="hidden items-center rounded-sm border border-paper/30 bg-transparent px-4 py-2 font-sans text-[0.78rem] font-semibold text-paper no-underline transition-all hover:border-paper hover:bg-paper hover:text-ink md:inline-flex"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
