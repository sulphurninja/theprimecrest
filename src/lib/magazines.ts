/**
 * The published digital magazine issues. Single source of truth for the
 * homepage marquee, the /magazine page, and the article seed.
 * Covers are the actual issue covers, exported from the press PDFs.
 */

export const MAGAZINE_DOMAIN = "https://magazines.theprimecrest.com";

export type MagazineIssue = {
  /** folio issue slug — also the /public/issues folder */
  slug: string;
  /** editorial article slug at /story/<articleSlug> */
  articleSlug: string;
  name: string;
  role: string;
  volume: string;
  title: string;
  cover: string;
  magazineUrl: string;
};

export const MAGAZINE_ISSUES: MagazineIssue[] = [
  {
    slug: "espey",
    articleSlug: "james-espey-sixty-years-behind-the-worlds-back-bar",
    name: "James Espey OBE",
    role: "Investor & Chairman, Wiltshire Whisky Distillery",
    volume: "Vol. I",
    title: "Sixty years behind the world's back bar",
    cover: "/issues/espey/magcover.jpg",
    magazineUrl: `${MAGAZINE_DOMAIN}/m/espey`,
  },
  {
    slug: "joan",
    articleSlug: "joan-gillman-forty-four-years-of-making-room-for-wonder",
    name: "Joan Gillman",
    role: "Science Teacher, The Browning School, New York",
    volume: "Vol. II",
    title: "Forty-four years of making room for wonder",
    cover: "/issues/joan/magcover.jpg",
    magazineUrl: `${MAGAZINE_DOMAIN}/m/joan`,
  },
  {
    slug: "nichole",
    articleSlug: "dr-nichole-pettway-where-you-have-been-does-not-decide-where-you-are-going",
    name: "Dr. Nichole Pettway",
    role: "Deputy Director, BOSS, California",
    volume: "Vol. III",
    title: "Where you have been does not decide where you are going",
    cover: "/issues/nichole/magcover.jpg",
    magazineUrl: `${MAGAZINE_DOMAIN}/m/nichole`,
  },
  {
    slug: "kohila",
    articleSlug: "kohila-sivas-readiness-before-performance",
    name: "Kohila Sivas",
    role: "Founder & Master Coach, Wholistic SuccessCodes",
    volume: "Vol. IV",
    title: "Readiness before performance",
    cover: "/issues/kohila/magcover.jpg",
    magazineUrl: `${MAGAZINE_DOMAIN}/m/kohila`,
  },
  {
    slug: "pallavi",
    articleSlug: "pallavi-pande-twenty-million-plates-later",
    name: "Pallavi Pande",
    role: "Founder & Owner, DTOCS & DTOCS Consulting",
    volume: "Vol. V",
    title: "Twenty million plates later",
    cover: "/issues/pallavi/magcover.jpg",
    magazineUrl: `${MAGAZINE_DOMAIN}/m/pallavi`,
  },
];
