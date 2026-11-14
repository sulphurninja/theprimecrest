import Link from "next/link";
import { Wordmark } from "@/components/site/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { BackToTop } from "@/components/site/BackToTop";
import { ExternalIcon } from "@/components/site/Icons";
import { SITE } from "@/lib/constants";

type Cat = { name: string; slug: string };

const JOURNAL_LINKS = [
  { label: "Magazine", href: "/magazine" },
  { label: "About", href: "/about" },
  { label: "Advertise", href: "/advertise" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "RSS Feed", href: "/feed.xml", external: true },
];

export function SiteFooter({
  siteName,
  blurb,
  copyright,
  categories,
}: {
  siteName: string;
  blurb: string;
  copyright: string;
  categories: Cat[];
}) {
  return (
    <footer className="grain mt-20 overflow-hidden bg-night text-paper">
      {/* Newsletter Band */}
      <div className="border-b border-paper/10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label !tracking-[0.28em] text-gold-soft">The PrimeCrest Briefing</p>
            <h3 className="display-caps mt-4 text-[2.2rem] text-white sm:text-[2.8rem]">
              Business intelligence, every morning
            </h3>
            <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-paper/60">
              The leaders, companies and decisions shaping global business, in one concise email.
            </p>
          </div>
          <div className="w-full max-w-md">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark name={siteName} className="text-[1.8rem] text-paper" showTagline />
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-paper/60">
              {blurb}
            </p>
            <div className="mt-6 border-t border-paper/10 pt-5">
              <p className="font-sans text-[0.72rem] text-paper/50">
                {siteName} is a product of{" "}
                <a
                  href="https://thefortiora.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-paper/80 no-underline transition-colors hover:text-paper"
                >
                  {SITE.company}
                </a>
              </p>
              <address className="mt-2 font-sans text-[0.72rem] not-italic leading-relaxed text-paper/40">
                {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
                <br />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-paper/40 no-underline transition-colors hover:text-paper/70"
                >
                  {SITE.email}
                </a>
              </address>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="font-display text-[1.3rem] font-semibold text-white">Sections</p>
              <span className="mt-3 block h-[2px] w-10 bg-accent" aria-hidden />
              <ul className="mt-5 space-y-2.5">
                {categories.filter((c) => c.slug !== "magazine").map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={c.slug === "home" ? "/" : `/c/${c.slug}`}
                      className="group inline-flex items-center gap-1 font-sans text-[0.9rem] text-paper/65 no-underline transition-colors hover:text-white"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display text-[1.3rem] font-semibold text-white">The Journal</p>
              <span className="mt-3 block h-[2px] w-10 bg-accent" aria-hidden />
              <ul className="mt-5 space-y-2.5">
                {JOURNAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-sans text-[0.9rem] text-paper/65 no-underline transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display text-[1.3rem] font-semibold text-white">Legal &amp; More</p>
              <span className="mt-3 block h-[2px] w-10 bg-accent" aria-hidden />
              <ul className="mt-5 space-y-2.5">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 font-sans text-[0.9rem] text-paper/65 no-underline transition-colors hover:text-white"
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.label}
                      {"external" in l && l.external && (
                        <ExternalIcon className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.75rem] text-paper/40">
            © {new Date().getFullYear()} {copyright} All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-serif text-[0.8rem] italic text-paper/40">
              Independent. International. Edited by people.
            </p>
            <BackToTop />
          </div>
        </div>
      </div>

      <p
        className="wordmark pointer-events-none -mb-[0.2em] select-none text-center text-[21vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(228,201,143,0.18)] lg:text-[17rem]"
        aria-hidden
      >
        {siteName}.
      </p>
    </footer>
  );
}
