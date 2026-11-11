import Link from "next/link";
import { SearchIcon } from "@/components/site/Icons";
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

const MAX_VISIBLE_CATEGORIES = 5;

const UTILITY_LINKS = [
  { label: "The Magazine", href: "/magazine" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Advertise", href: "/advertise" },
  { label: "About", href: "/about" },
];

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
  const magazine = { label: "Magazine", href: "/magazine" };
  const contact = { label: "Contact", href: "/contact" };
  // Magazine sits right after the lead section.
  const placeFixed = (items: { label: string; href: string }[]) =>
    items.length === 0 ? [magazine, contact] : [items[0], magazine, ...items.slice(1), contact];

  const sectionHref = (c: NavItem) => (c.slug === "home" ? "/" : `/c/${c.slug}`);
  const sections = categories.filter((c) => c.slug !== "magazine");
  const catItems = sections
    .slice(0, MAX_VISIBLE_CATEGORIES)
    .map((c) => ({ label: c.name, href: sectionHref(c) }));
  const visibleItems = placeFixed(catItems);
  const hasMore = sections.length > MAX_VISIBLE_CATEGORIES;

  const allItems = placeFixed(sections.map((c) => ({ label: c.name, href: sectionHref(c) })));

  const socialLinks = [
    { url: socials?.twitter, icon: <TwitterIcon />, label: "Twitter" },
    { url: socials?.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { url: socials?.linkedin, icon: <LinkedInIcon />, label: "LinkedIn" },
    { url: socials?.facebook, icon: <FacebookIcon />, label: "Facebook" },
    { url: socials?.youtube, icon: <YouTubeIcon />, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <>
      {/* Utility bar */}
      <div className="border-b border-ink/10 bg-surface">
        <div className="mx-auto flex h-10 max-w-[1320px] items-center gap-4 px-4 sm:px-6">
          <span className="shrink-0 font-sans text-[0.76rem] font-semibold text-ink">
            {formatMastheadDate()}
          </span>
          {ticker ? (
            <span className="hidden min-w-0 items-center gap-2.5 border-l border-ink/10 pl-4 md:flex">
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent/10 px-2 py-0.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] text-accent">
                <span className="wire-pulse !h-1.5 !w-1.5" aria-hidden /> Live
              </span>
              <span className="truncate font-sans text-[0.78rem] text-ink-soft">{ticker}</span>
            </span>
          ) : null}
          <div className="ml-auto hidden shrink-0 items-center gap-5 lg:flex">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[0.76rem] font-medium text-ink-soft no-underline transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {socialLinks.length > 0 ? (
              <span className="flex items-center gap-0.5 border-l border-ink/10 pl-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-ink [&_svg]:h-3.5 [&_svg]:w-3.5"
                  >
                    {s.icon}
                  </a>
                ))}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 text-ink backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[76px]">
          <div className="flex items-center gap-3">
            <div className="xl:hidden">
              <MobileNav items={allItems} siteName={siteName} tagline={tagline} />
            </div>
            <Wordmark name={siteName} className="text-[1.6rem] text-ink lg:text-[1.95rem]" />
          </div>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Sections">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 font-sans text-[0.9rem] font-medium text-ink-soft no-underline transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            {hasMore && (
              <Link
                href="/search"
                className="rounded-full px-3.5 py-2 font-sans text-[0.9rem] font-medium text-muted no-underline transition-colors hover:bg-ink/[0.05] hover:text-ink"
              >
                More
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <SearchIcon className="h-[16px] w-[16px]" />
            </Link>
            <Link href="/newsletter" className="btn-primary hidden !py-2.5 md:inline-flex">
              Subscribe
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
