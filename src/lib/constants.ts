export const SITE = {
  name: "PrimeCrest",
  tagline: "A journal of affairs, business, and culture.",
  description:
    "PrimeCrest is a weekly editorial on power, capital, culture, and the people who shape them. Independent reporting. Considered writing.",
  issue: "Vol. IV · No. 33",
} as const;

export const NAV = [
  { label: "Affairs", href: "/c/affairs" },
  { label: "Business", href: "/c/business" },
  { label: "Leadership", href: "/c/leadership" },
  { label: "Culture", href: "/c/culture" },
  { label: "Ideas", href: "/c/ideas" },
  { label: "Science", href: "/c/science" },
  { label: "Lifestyle", href: "/c/lifestyle" },
] as const;

export const AD_SLOTS = [
  {
    key: "header-leaderboard",
    name: "Header leaderboard",
    placement: "Every page, beneath the masthead",
    width: 970,
    height: 90,
  },
  {
    key: "homepage-mid",
    name: "Homepage mid-well",
    placement: "Between The Briefing and the cover story",
    width: 728,
    height: 90,
  },
  {
    key: "homepage-mpu",
    name: "Homepage MPU",
    placement: "Inside The Briefing grid",
    width: 300,
    height: 250,
  },
  {
    key: "article-inline",
    name: "In-article",
    placement: "After the second section in long features",
    width: 728,
    height: 90,
  },
  {
    key: "article-sidebar",
    name: "Article sidebar",
    placement: "Desktop article rail",
    width: 300,
    height: 600,
  },
  {
    key: "category-top",
    name: "Section header",
    placement: "Top of category pages",
    width: 728,
    height: 90,
  },
  {
    key: "footer-strip",
    name: "Footer strip",
    placement: "Above the footer on all pages",
    width: 970,
    height: 90,
  },
] as const;

export const SESSION_COOKIE = "pc_session";
export const SESSION_DAYS = 7;

export const RESERVED_PATHS = [
  "admin",
  "api",
  "c",
  "story",
  "author",
  "advertise",
  "about",
  "contact",
  "search",
  "privacy",
  "terms",
  "media-kit",
  "newsletter",
  "login",
];
