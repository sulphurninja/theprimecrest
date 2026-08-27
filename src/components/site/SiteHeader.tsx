import Link from "next/link";
import { Search } from "lucide-react";
import { Wordmark } from "@/components/site/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { formatMastheadDate } from "@/lib/utils";

type NavItem = { name: string; slug: string };
type Socials = {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
};

const MAX_VISIBLE_CATEGORIES = 8;

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function SiteHeader({
  siteName,
  tagline,
  ticker,
  categories,
  socials,
}: {
  siteName: string;
  tagline: string;
  issueLabel?: string;
  ticker?: string;
  categories: NavItem[];
  socials?: Socials;
}) {
  const catItems = categories.slice(0, 5).map((c) => ({ label: c.name, href: `/c/${c.slug}` }));
  const visibleItems = [
    ...catItems,
    { label: "Magazine", href: "/magazine" },
    { label: "Contact Us", href: "/contact" },
  ];
  const hasMore = categories.length > 5;

  const allItems = [
    ...categories.map((c) => ({ label: c.name, href: `/c/${c.slug}` })),
    { label: "Magazine", href: "/magazine" },
    { label: "Contact Us", href: "/contact" },
  ];

  const socialLinks = [
    { url: socials?.twitter, icon: <TwitterIcon />, label: "Twitter" },
    { url: socials?.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { url: socials?.linkedin, icon: <LinkedInIcon />, label: "LinkedIn" },
    { url: socials?.facebook, icon: <FacebookIcon />, label: "Facebook" },
    { url: socials?.youtube, icon: <YouTubeIcon />, label: "YouTube" },
  ].filter((s) => s.url);

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
            <MobileNav items={allItems} siteName={siteName} tagline={tagline} dark />
          </div>

          <div className="hidden min-w-0 items-center gap-7 lg:flex">
            <Wordmark name={siteName} className="text-[1.7rem] text-paper" showTagline />
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

          {/* Right — socials + actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {socialLinks.length > 0 ? (
              <div className="mr-1 hidden items-center gap-0.5 lg:flex">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-paper/50 transition-all hover:bg-paper/10 hover:text-paper"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : null}
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
