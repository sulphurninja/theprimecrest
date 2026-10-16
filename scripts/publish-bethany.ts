/**
 * Upserts the Nick Hill / Bethany Children's Home feature.
 * Run: node --env-file=.env.local --import tsx scripts/publish-bethany.ts
 */
import { dbConnect } from "../src/lib/db";
import { User, Category, Article } from "../src/models";
import { readingTime } from "../src/lib/utils";
import { MAGAZINE_ISSUES } from "../src/lib/magazines";

const issue = MAGAZINE_ISSUES.find((item) => item.slug === "bethany");
if (!issue) throw new Error("Bethany is not in MAGAZINE_ISSUES");

const content = `<p>Bethany Children's Home sits on the Philadelphia side of Pennsylvania. It takes young people in when the systems around them run thin: shelter beds for the night, residential cottages for the longer road, and transitional living for the step toward independence. The services are in-house. Aftercare stays with a young person after they leave. A young person does not arrive with a tidy problem.</p>
<p>Nick Hill came up inside those programs. Cottage Support Staff first: the floor, the direct work with youth. Then the other posts, administrative and on the floor, until the board moved him to the chair. He still talks like a man who worked the cottages, because he did.</p>
<h2>The order of the file</h2>
<p>The cottages are thirteen buildings, like big houses: living rooms, kitchens, bedrooms. They hold more than one young person. Some licenses go as high as thirty-two. Most hold up to twelve. Direct care is unglamorous and exact. The same shift, the same cottage, the same group, held steady until steadiness starts to mean something. He watched how often the difference between giving up and going on was a single adult who refused to leave.</p>
<p>He moved through leadership posts, served as Deputy Chief Executive and Chief Human Resources Officer, and in July 2026 the board named him President and Chief Executive Officer. The title changed. The work with youth did not.</p>
<p>Ask him what he wants from a leader when the week turns hard and the answer arrives in that order. Listen first. Make the hard call. Take the blame when it lands. Staff should have a voice, work that matters, and room to grow. Circumstances should never determine potential. A child's address is not a verdict, and the file is never the whole story.</p>
<h2>What the door receives</h2>
<p>By the time a young person reaches residential or emergency care, years usually sit behind that night. What is not visible is the slow accumulation that led to it: mental and behavioral health left unaddressed, family instability, poverty, trauma, isolation, barriers at school. Many arrive unable to find a floor that holds.</p>
<p>Hill's argument is not complicated, and he makes it often. Put the money earlier. Families, schools, mental health, work, the ordinary good days that keep a child out of a crisis bed. By the time the door at Bethany is the last one open, the least expensive help is already years in the past.</p>
<p>A title does not make someone a leader. People do. Accountability does. Purpose does. If he is any good at this, he will tell you, the programs are stronger because of the people he has developed.</p>`;

async function main() {
  await dbConnect();
  const [magazine, affairs, author] = await Promise.all([
    Category.findOne({ slug: "magazine" }),
    Category.findOne({ slug: "affairs" }),
    User.findOne({ role: "admin" }).then((user) => user || User.findOne()),
  ]);
  if (!magazine || !author) throw new Error("Missing magazine category or author");

  const article = await Article.findOneAndUpdate(
    { slug: issue!.articleSlug },
    {
      $set: {
        title: "Nick Hill: The Floor, First",
        slug: issue!.articleSlug,
        dek: "He started as Cottage Support Staff at Bethany Children's Home, then carried the work through the programs until the board named him President and Chief Executive Officer.",
        excerpt:
          "Nick Hill learned Bethany Children's Home from the cottage floor. In July 2026 the board named him President and CEO. Circumstances, he says, should never determine potential.",
        content,
        coverImage: "/issues/bethany/wide.jpg",
        coverCaption: "Nick Hill, photographed for The September Issue.",
        coverCredit: "Portrait supplied by Bethany Children's Home",
        ogImage: issue!.cover,
        magazineCover: issue!.cover,
        category: magazine._id,
        categories: [magazine._id, affairs?._id].filter(Boolean),
        tags: ["The September Issue", "Leadership", "Digital Magazine"],
        author: author._id,
        status: "published",
        featured: true,
        format: "feature",
        allowAds: true,
        seoDescription:
          "Nick Hill learned Bethany Children's Home from the cottage floor. In July 2026 the board named him President and CEO.",
        readTime: readingTime(content),
        magazineUrl: issue!.magazineUrl,
        magazineEnabled: true,
        publishedAt: new Date(),
        pullQuote: {
          text: "A title does not make someone a leader. People do. Accountability does. Purpose does.",
          attribution: "Nick Hill",
        },
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  console.log("published", article?.slug);
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
