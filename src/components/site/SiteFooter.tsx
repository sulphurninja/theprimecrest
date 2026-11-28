import Link from "next/link";
import { Wordmark } from "@/components/site/Logo";
import { CREST_LOWER, CREST_UPPER, FULL_STOP, LETTERS, LOGO_VIEWBOX } from "@/components/site/logo-paths";
import { BackToTop } from "@/components/site/BackToTop";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  YouTubeIcon,
} from "@/components/site/SiteHeader";
import { SITE } from "@/lib/constants";

type Cat = { name: string; slug: string };
type Socials = {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
};

const ABOUT_LINKS = [
  { label: "About PrimeCrest", href: "/about" },
  { label: "Advertise with us", href: "/advertise" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "RSS Feed", href: "/feed.xml" },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-display text-[1.05rem] font-semibold text-white">{title}</p>
      <ul className="mt-3 space-y-1.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="font-sans text-[0.86rem] text-white/70 no-underline transition-colors hover:text-gold-soft"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({
  siteName,
  blurb,
  copyright,
  categories,
  socials,
}: {
  siteName: string;
  blurb: string;
  copyright: string;
  categories: Cat[];
  socials?: Socials;
}) {
  const navigate = [
    { label: "Home", href: "/" },
    { label: "Magazine", href: "/magazine" },
    ...categories
      .filter((c) => c.slug !== "home" && c.slug !== "magazine")
      .map((c) => ({ label: c.name, href: `/c/${c.slug}` })),
  ];

  const socialLinks = [
    { url: socials?.linkedin, icon: <LinkedInIcon />, label: "LinkedIn" },
    { url: socials?.instagram, icon: <InstagramIcon />, label: "Instagram" },
    { url: socials?.twitter, icon: <TwitterIcon />, label: "X" },
    { url: socials?.facebook, icon: <FacebookIcon />, label: "Facebook" },
    { url: socials?.youtube, icon: <YouTubeIcon />, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="mt-20 overflow-hidden bg-brand text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:border-r lg:border-white/20 lg:pr-8">
            <Wordmark name={siteName} className="text-[2.1rem] text-white" />
            <p className="mt-4 font-sans text-[0.7rem] font-medium uppercase leading-[1.8] tracking-[0.22em] text-white/70">
              The international magazine
              <br />
              of leadership &amp; business
            </p>
            <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-white/65">{blurb}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <Column title="Navigate" links={navigate} />
            <Column title="About" links={ABOUT_LINKS} />
            <Column title="Legal" links={LEGAL_LINKS} />
          </div>

          <div className="lg:col-span-3 lg:border-l lg:border-white/20 lg:pl-8">
            <p className="font-display text-[1.05rem] font-semibold text-white">Connect with {siteName}</p>
            {socialLinks.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/85 transition-colors hover:border-gold-soft hover:text-gold-soft [&_svg]:h-4 [&_svg]:w-4"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : null}
            <address className="mt-5 font-sans text-[0.78rem] not-italic leading-relaxed text-white/55">
              {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
              <br />
              <a href={`mailto:${SITE.email}`} className="text-white/55 no-underline hover:text-gold-soft">
                {SITE.email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[0.8rem] text-white/60">
            © {new Date().getFullYear()} {copyright} All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://thefortiora.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[0.8rem] text-white/60 no-underline hover:text-gold-soft"
            >
              A {SITE.company.replace(/ LLC$/, "")} publication
            </a>
            <BackToTop />
          </div>
        </div>
      </div>
      {/* The masthead in outline, full width, bleeding off the bottom of the page. */}
      <div className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6" aria-hidden>
        <svg viewBox={LOGO_VIEWBOX} className="-mb-[1.5%] block w-full select-none">
          <g fill="none" stroke="rgba(228,201,143,0.24)" strokeWidth="2.5">
            <path d={CREST_UPPER} vectorEffect="non-scaling-stroke" />
            <path d={CREST_LOWER} vectorEffect="non-scaling-stroke" />
            <path d={LETTERS} vectorEffect="non-scaling-stroke" />
            <path d={FULL_STOP} vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      </div>
    </footer>
  );
}
