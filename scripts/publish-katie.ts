/**
 * Upserts the Katie Holmes feature and adds her cover to Women in Business.
 * Run: node --env-file=.env.local --import tsx scripts/publish-katie.ts
 */
import { dbConnect } from "../src/lib/db";
import { User, Category, Article } from "../src/models";
import { readingTime } from "../src/lib/utils";
import { MAGAZINE_ISSUES } from "../src/lib/magazines";

const issue = MAGAZINE_ISSUES.find((item) => item.slug === "katie");
if (!issue) throw new Error("Katie is not in MAGAZINE_ISSUES");

const content = `<p>Katie Holmes founded Brand Studio Creative because she watched owners who had already built the business fail to get the brand to match it. The work was good. The clients were cared for. The site and the mark did not say so. She wanted a room where those owners were heard through the making of the thing, not hurried past it.</p>
<p>She calls the method Branding with Heart. A business, she says, is often someone's baby, and she does not take that trust lightly. Curiosity, collaboration, and honest talk sit at the desk before a typeface does. The point is not a beautiful file. The point is a brand that feels true to the person behind it, and that gives her the nerve to show up.</p>
<h2>How a job starts</h2>
<p>She begins at the heart of the business. Purpose, audience, goals, personality, and, most of all, how the owner wants people to feel when they meet the brand. She asks a lot of questions because the more she understands, the more deliberate the work can be. Then she looks for the connections and turns them into strategy, a visual identity, messaging, and a website that can be used.</p>
<p>What she would tell an owner who wants to start there: begin with why you do the work, who you are best equipped to help, what makes the approach different, and how you want people to feel. Do not build the brand around a trend. Build it around what is true, and around where the shop is going, not only where it is today. Invest in a foundation. Make tools you can use again. When the brand is honest and the strategy is clear, showing up gets easier and the right people can tell why you are the right choice.</p>
<h2>Beauty is not enough</h2>
<p>Once the questions are on the table she looks for the lines between them. The brand has to help the right people understand the business, remember it, and take the next step. Looking good is not the job. Looking good and being usable is the job. She treats creativity, the client's needs, and strategy as one process, not three departments arguing.</p>
<p>The client leaves with guidelines, templates, assets in order, and a final walkthrough so the owner knows how to use what she paid for. A brand that only looks right on launch day has failed her test. It should make showing up and marketing the business feel lighter long after the files are delivered.</p>
<p>Authenticity and clarity, she says, are what still make a brand hold. The feed is full of polish and borrowed looks. The brands people remember feel distinct, human, and honest. They do not try to please everyone. They say what the business believes, who it serves, and why the approach matters.</p>
<h2>Flower House Dallas</h2>
<p>Flower House Dallas grew past the original job: the site, the marketing, the merchandise, and the wraps on the cars. Lauren is still using what they made. The brand, Katie says, helped her attract the clients she wanted. Watching someone go from embarrassed by her brand to proud enough to share it never gets old.</p>
<p>Websites, she says, will have to do more than post information. They will have to move a person from first look to trust to the next step. Tools will get faster. That does not make the brand. The heart and the story still have to be protected, or the work is only a file.</p>`;

async function main() {
  await dbConnect();
  const [magazine, affairs, women, author] = await Promise.all([
    Category.findOne({ slug: "magazine" }),
    Category.findOne({ slug: "affairs" }),
    Category.findOne({ slug: "women-in-business" }),
    User.findOne({ role: "admin" }).then((user) => user || User.findOne()),
  ]);
  if (!magazine || !author) throw new Error("Missing magazine category or author");

  const article = await Article.findOneAndUpdate(
    { slug: issue!.articleSlug },
    {
      $set: {
        title: "Katie Holmes: Branding with Heart",
        slug: issue!.articleSlug,
        dek: "Owners who had already built the business still could not get the brand to match it. Katie Holmes built Brand Studio Creative so the work starts with the person, then the mark.",
        excerpt:
          "Founder and CEO of Brand Studio Creative. Branding with Heart, Flower House Dallas, and the walkthrough that stays useful after launch day.",
        content,
        coverImage: "/issues/katie/wide.jpg",
        coverCaption: "Katie Holmes, photographed for The October Issue.",
        coverCredit: "Photograph by Kyrsten Ashlay Photography",
        ogImage: issue!.cover,
        magazineCover: issue!.cover,
        category: magazine._id,
        categories: [magazine._id, affairs?._id, women?._id].filter(Boolean),
        tags: ["The October Issue", "Branding", "Women in Business", "Digital Magazine"],
        author: author._id,
        status: "published",
        featured: true,
        format: "feature",
        allowAds: true,
        seoDescription:
          "Founder and CEO of Brand Studio Creative. Branding with Heart, Flower House Dallas, and the walkthrough that stays useful after launch day.",
        readTime: readingTime(content),
        magazineUrl: issue!.magazineUrl,
        magazineEnabled: true,
        publishedAt: new Date(),
        pullQuote: {
          text: "Your business has a heart. Your brand should feel like it.",
          attribution: "Katie Holmes",
        },
      },
    },
    { upsert: true, new: true },
  );

  if (women && !(women.magazines || []).some((id) => String(id) === String(article._id))) {
    women.magazines = [...(women.magazines || []), article._id];
    await women.save();
  }

  console.log("published", article.slug);
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
