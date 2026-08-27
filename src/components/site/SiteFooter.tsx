import Link from "next/link";
import { Wordmark } from "@/components/site/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { BackToTop } from "@/components/site/BackToTop";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/constants";

type Cat = { name: string; slug: string };

const JOURNAL_LINKS = [
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
    <footer className="mt-20 bg-ink text-paper">
      {/* Newsletter Band */}
      <div className="border-b border-paper/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-5 py-12 text-center lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <p className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-accent">
              Stay Informed
            </p>
            <h3 className="headline mt-2 text-[1.5rem] text-paper sm:text-[1.75rem]">
              Get the briefing in your inbox
            </h3>
            <p className="mt-2 font-serif text-[0.95rem] text-paper/60">
              One letter, each morning. The stories that matter.
            </p>
          </div>
          <div className="w-full max-w-md">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark name={siteName} className="text-[1.8rem] text-paper" showTagline />
            <p className="mt-5 max-w-sm font-serif text-[0.95rem] leading-relaxed text-paper/60">
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
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-paper/40">
                Sections
              </p>
              <ul className="mt-4 space-y-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/c/${c.slug}`}
                      className="group inline-flex items-center gap-1 font-sans text-[0.875rem] text-paper/70 no-underline transition-colors hover:text-paper"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-paper/40">
                The Journal
              </p>
              <ul className="mt-4 space-y-2">
                {JOURNAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-sans text-[0.875rem] text-paper/70 no-underline transition-colors hover:text-paper"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-paper/40">
                Legal & More
              </p>
              <ul className="mt-4 space-y-2">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 font-sans text-[0.875rem] text-paper/70 no-underline transition-colors hover:text-paper"
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {l.label}
                      {"external" in l && l.external && (
                        <ArrowUpRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
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
              Written by people. Edited by people.
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
