/**
 * PrimeCrest database seed.
 * Run with: bun run seed
 * Wipes and repopulates: users, categories, articles, ad slots, pages,
 * settings, and the homepage configuration.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { dbConnect } from "../src/lib/db";
import {
  User,
  Category,
  Article,
  AdSlot,
  AdCampaign,
  Page,
  Settings,
  Homepage,
} from "../src/models";
import { AD_SLOTS } from "../src/lib/constants";
import { slugify, readingTime } from "../src/lib/utils";
import { SEED_ARTICLES } from "./seed-articles";

const avatar = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&h=400&q=80`;

const USERS = [
  {
    name: "Adrian Cole",
    email: process.env.ADMIN_SEED_EMAIL || "admin@primecrest.com",
    password: process.env.ADMIN_SEED_PASSWORD || "PrimeCrest2026!",
    role: "admin" as const,
    title: "Editor-in-Chief",
    bio: "Adrian Cole edits PrimeCrest. Previously an editor on business and technology desks in London and New York, he believes the sentence is still the unit of trust.",
    avatar: avatar("photo-1560250097-0b93528c311a"),
  },
  {
    name: "Mara Whitfield",
    email: "mara@primecrest.com",
    password: "PrimeCrest2026!",
    role: "editor" as const,
    title: "Senior Correspondent",
    bio: "Mara Whitfield reports on power — electrical and political. Her work on infrastructure and security has taken her to forty countries and several substations.",
    avatar: avatar("photo-1573497019940-1c28c88b4f3e"),
  },
  {
    name: "Tomas Reyes",
    email: "tomas@primecrest.com",
    password: "PrimeCrest2026!",
    role: "author" as const,
    title: "Staff Writer",
    bio: "Tomas Reyes covers ideas, business, and the places they collide. He came to journalism from a decade as an operator and still reads footnotes first.",
    avatar: avatar("photo-1507003211169-0a1dd7228f2d"),
  },
];

const CATEGORIES = [
  {
    name: "Affairs",
    kicker: "The World",
    description: "Reporting on power, policy, and security — the forces that set the terms for everything else.",
    order: 1,
  },
  {
    name: "Business",
    kicker: "Money & Markets",
    description: "Companies, capital, and the people who move them. Coverage that respects the reader's time and intelligence.",
    order: 2,
  },
  {
    name: "Leadership",
    kicker: "The Corner Office",
    description: "Management, decision-making, and organisational craft — what actually works, reported without the seminar gloss.",
    order: 3,
  },
  {
    name: "Culture",
    kicker: "Arts & Society",
    description: "Music, food, screens, and the shared life. Criticism with a pulse and features with a point.",
    order: 4,
  },
  {
    name: "Ideas",
    kicker: "Essays & Argument",
    description: "Long thoughts, carefully made. Essays on technology, language, and how we live now.",
    order: 5,
  },
  {
    name: "Science",
    kicker: "The Frontier",
    description: "From the seafloor to the grid to the lab — the systems that hold the modern world together.",
    order: 6,
  },
  {
    name: "Lifestyle",
    kicker: "Living Well",
    description: "Style, health, and taste — covered with rigour, worn lightly.",
    order: 7,
  },
];

const PAGES = [
  {
    title: "About PrimeCrest",
    slug: "about",
    excerpt: "A journal of affairs, business, and culture — written by people, edited by people.",
    content: `<p>PrimeCrest is an independent editorial publication covering power, capital, culture, and the people who shape them. We publish reported features, interviews, essays, and a daily briefing — written by people, edited by people, and set with care.</p>
<p>We launched in 2024 with a simple bet: that there remains an audience — substantial, underserved, and willing to pay attention — for journalism that respects both the complexity of the world and the intelligence of its readers.</p>
<h2>What we believe</h2>
<p>Attention is the reader's gift, not our entitlement. Every story must earn its length. We correct errors prominently, mark sponsored work clearly, and never let an advertiser near an editorial decision.</p>
<p>We believe the sentence is still the unit of trust. We believe a publication earns its audience one paragraph at a time. We believe the best journalism is both rigorous and readable — and that those goals are not in tension.</p>
<h2>How we work</h2>
<p>Our editorial team is small by design. We have no investors to please and no traffic targets to chase. Every editor writes; every writer edits. Stories are fact-checked before publication and corrected promptly when we get something wrong.</p>
<p>We do not publish content written by artificial intelligence. Every story carries the name of the person who reported it and the editor who shaped it.</p>
<h2>How we make money</h2>
<p>Advertising, sold directly. Our inventory is deliberately scarce: fixed placements, named sponsors, no programmatic exchanges, no data brokers. If you would like to reach our readers, see our <a href="/advertise">advertising page</a>.</p>
<h2>Reach the desk</h2>
<p>Tips, pitches, and corrections: <a href="mailto:desk@primecrest.com">desk@primecrest.com</a>. General inquiries: <a href="mailto:hello@primecrest.com">hello@primecrest.com</a>. We read everything.</p>`,
  },
  {
    title: "Privacy Policy",
    slug: "privacy",
    excerpt: "What we collect, what we don't, and why the list is short.",
    content: `<p>PrimeCrest collects the minimum information required to operate a publication. We believe privacy is a right, not a preference — and we design our systems accordingly.</p>
<h2>Information we collect</h2>
<p><strong>Newsletter subscribers:</strong> Your email address and the date you subscribed. Nothing more. Every edition includes a working unsubscribe link, which takes effect immediately and permanently.</p>
<p><strong>Contact form submissions:</strong> The contents of your message and any contact information you provide. We use this only to respond to your inquiry.</p>
<p><strong>Advertisers:</strong> Business contact information necessary to execute advertising agreements.</p>
<h2>Information we do not collect</h2>
<p>We do not use cookies for tracking. We do not build profiles of individual readers. We do not sell, rent, or share reader data with third parties. We do not operate behavioural advertising. We do not employ fingerprinting or other covert tracking technologies.</p>
<h2>Analytics</h2>
<p>We measure aggregate readership — which stories are read, and approximately how many people read them — using privacy-preserving analytics that do not track individuals across pages or sessions.</p>
<h2>Third parties</h2>
<p>Advertising on this site is served directly from our own infrastructure. We do not use third-party ad networks, tracking pixels, or programmatic advertising platforms.</p>
<h2>Data retention</h2>
<p>Newsletter subscriber data is retained until you unsubscribe. Contact form submissions are retained for one year, then deleted. We do not maintain archives of reader behaviour.</p>
<h2>Your rights</h2>
<p>You may request a copy of any data we hold about you, or request its deletion, by writing to <a href="mailto:privacy@primecrest.com">privacy@primecrest.com</a>. We will respond within 30 days.</p>
<h2>Changes</h2>
<p>If we change this policy in ways that affect your rights, we will notify newsletter subscribers by email and post a prominent notice on the site.</p>
<h2>Questions</h2>
<p>Write to <a href="mailto:privacy@primecrest.com">privacy@primecrest.com</a> and a person will answer.</p>`,
  },
  {
    title: "Terms of Use",
    slug: "terms",
    excerpt: "The short version: read generously, quote fairly, don't scrape.",
    content: `<p>Welcome to PrimeCrest. By using this site you agree to a few reasonable things.</p>
<h2>Content and copyright</h2>
<p>Everything published on PrimeCrest — articles, photographs, illustrations, and design — is protected by copyright. You may quote our work with attribution and a link back to the original; that is what journalism is for, and we encourage it.</p>
<p>Wholesale reproduction, systematic downloading, automated scraping, and use of our archive to train machine learning models require a written licence. Write to <a href="mailto:licensing@primecrest.com">licensing@primecrest.com</a> to discuss terms.</p>
<h2>User conduct</h2>
<p>You agree not to interfere with the operation of this site, attempt to gain unauthorised access to our systems, or use automated tools to access content in ways that exceed normal human reading patterns.</p>
<h2>Advertising and sponsorship</h2>
<p>Sponsored content and paid partnerships are always clearly labelled. Advertisers have no influence over editorial coverage, and the presence of an advertisement is not an endorsement of the advertiser's products, services, or views.</p>
<h2>Accuracy and corrections</h2>
<p>We work hard to be accurate and correct errors prominently when we fail. If you believe we have published something inaccurate, write to <a href="mailto:corrections@primecrest.com">corrections@primecrest.com</a>.</p>
<h2>Limitation of liability</h2>
<p>The site is provided as-is. While we strive for accuracy, we make no warranties about the completeness or reliability of our content. We are not liable for decisions made on the basis of our reporting, or for any damages arising from use of this site.</p>
<h2>Changes</h2>
<p>We may update these terms from time to time. Continued use of the site following changes constitutes acceptance of those changes.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of the State of New York, United States. Any disputes will be resolved in the courts of New York County.</p>
<h2>Contact</h2>
<p>Questions about these terms: <a href="mailto:legal@primecrest.com">legal@primecrest.com</a>.</p>`,
  },
];

async function main() {
  console.log("Connecting to MongoDB…");
  await dbConnect();

  console.log("Clearing collections…");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Article.deleteMany({}),
    AdSlot.deleteMany({}),
    AdCampaign.deleteMany({}),
    Page.deleteMany({}),
    Settings.deleteMany({}),
    Homepage.deleteMany({}),
  ]);

  console.log("Creating team…");
  const users = await User.create(
    await Promise.all(
      USERS.map(async (u) => ({
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash: await bcrypt.hash(u.password, 12),
        role: u.role,
        slug: slugify(u.name),
        title: u.title,
        bio: u.bio,
        avatar: u.avatar,
        socials: { twitter: "https://x.com/primecrest", linkedin: "" },
      })),
    ),
  );

  console.log("Creating sections…");
  const categories = await Category.create(
    CATEGORIES.map((c) => ({
      ...c,
      slug: slugify(c.name),
      seoTitle: `${c.name} — PrimeCrest`,
      seoDescription: c.description,
    })),
  );
  const catBySlug = new Map(categories.map((c) => [c.slug, c._id]));

  console.log("Filing stories…");
  const now = Date.now();
  await Article.insertMany(
    SEED_ARTICLES.map((a) => {
      const publishedAt = new Date(now - a.daysAgo * 24 * 3600 * 1000 - 6 * 3600 * 1000);
      return {
        title: a.title,
        slug: slugify(a.title),
        dek: a.dek,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
        coverCaption: a.coverCaption || "",
        coverCredit: a.coverCredit || "",
        category: catBySlug.get(a.categorySlug)!,
        tags: a.tags,
        author: users[a.authorIndex]._id,
        status: "published",
        publishedAt,
        featured: Boolean(a.featured),
        isHero: Boolean(a.isHero),
        isCoverStory: Boolean(a.isCoverStory),
        format: a.format,
        allowAds: true,
        seoTitle: "",
        seoDescription: a.seoDescription || a.excerpt,
        readTime: readingTime(a.content),
        pullQuote: a.pullQuote || { text: "", attribution: "" },
        views: Math.floor(Math.random() * 4000) + 300,
      };
    }),
  );

  console.log("Reserving ad inventory…");
  await AdSlot.create(AD_SLOTS.map((s) => ({ ...s, enabled: true })));

  console.log("Writing standing pages…");
  await Page.create(PAGES.map((p) => ({ ...p, published: true })));

  console.log("Configuring the journal…");
  await Settings.create({
    siteName: "PrimeCrest",
    tagline: "A journal of affairs, business, and culture.",
    description:
      "PrimeCrest publishes considered journalism on power, capital, culture, and the people who shape them. Independent reporting. Written by people.",
    issueLabel: "Vol. IV · No. 33",
    ticker:
      "Grid regulators warn transformer lead times have reached five years — our lead story",
    footerBlurb:
      "PrimeCrest publishes considered journalism on power, capital, culture, and the people who shape them. Independent, reader-first, and set with care.",
    copyright: "PrimeCrest Media Ltd.",
    contactEmail: "desk@primecrest.com",
    advertiseEmail: "advertise@primecrest.com",
  });

  await Homepage.create({
    showAds: true,
    showNewsletter: true,
    showAdvertiseBand: true,
  });

  const adminEmail = USERS[0].email;
  const adminPass = USERS[0].password;
  console.log("\nSeed complete.");
  console.log(`  Stories:     ${SEED_ARTICLES.length} published`);
  console.log(`  Sections:    ${categories.length}`);
  console.log(`  Team:        ${users.length}`);
  console.log(`  Admin login: ${adminEmail} / ${adminPass}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
