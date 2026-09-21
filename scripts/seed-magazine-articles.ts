/**
 * Seeds the five digital-magazine feature articles.
 * Non-destructive: upserts the Magazine category and these five slugs only.
 * Run with: node --env-file=.env.local --import tsx scripts/seed-magazine-articles.ts
 */
import mongoose from "mongoose";
import { dbConnect } from "../src/lib/db";
import { User, Category, Article } from "../src/models";
import { readingTime } from "../src/lib/utils";
import { MAGAZINE_ISSUES } from "../src/lib/magazines";

type MagArticle = {
  issueSlug: string;
  title: string;
  dek: string;
  excerpt: string;
  coverImage: string;
  coverCaption: string;
  tags: string[];
  pullQuote: { text: string; attribution: string };
  content: string;
};

const ARTICLES: MagArticle[] = [
  {
    issueSlug: "espey",
    title: "James Espey: Sixty Years Behind the World's Back Bar",
    dek: "Baileys remade, Malibu invented, Blue Label built, and a hundred-million-dollar demand that became five million cases of Chivas a year. The man who poured the modern drinks trade, at eighty-three, is still laying down stock.",
    excerpt:
      "From a tin-roofed house in Livingstone to the main board of IDV, James Espey OBE built or remade the brands worth more than £5 billion to Diageo — and he can still recite every number.",
    coverImage: "/issues/espey/wide.jpg",
    coverCaption: "James Espey OBE, photographed for The September Issue.",
    tags: ["The September Issue", "Leadership", "Spirits", "Digital Magazine"],
    pullQuote: {
      text: "If you want a twenty-year whisky, you have to buy the years.",
      attribution: "James Espey OBE",
    },
    content: `<p>James Espey was born in Zambia in 1943, in the Livingstone hospital, twenty-one years after his mother was born in the same building. Her grandfather kept the books for the company that built the Victoria Falls Bridge; the family lived in huts on the bank of the Zambezi while the steel went up, and later in the first house in Livingstone with a tin roof. That is the file he still opens with. Not a brand, not a kilt, not a case number. A hospital, a bridge, a roof that kept the rain off.</p>
<p>School was Cape Town — four days and four nights by train, twice a year, for ten and a half years. A BCom in marketing and accounting from the University of Cape Town in 1965, then a full-time MBA finished in 1969 with a thesis written inside Coca-Cola. They offered him the canning desk. He chose the drinks trade instead, and repaid the loans that bought both degrees shortly after his thirtieth birthday.</p>
<h2>A savage from the colonies</h2>
<p>In 1970 he joined Gilbeys South Africa as sales director. In 1977 London called: group marketing director of International Distillers &amp; Vintners, and that November, the main board — the first non-Englishman on it. Not everyone approved. To some of the club he was "a savage from the colonies," and they said so. He kept the phrase. It is how the room sounded when a man from Livingstone sat down with men who had never taken the train.</p>
<p>The savage got to work. He remade Baileys into the world's No. 1 liqueur, some eight million cases a year. In 1979 he took a South African coconut drink called Coco Rico, found a Malibu trademark in the cupboard, bottled it in Harlow, Essex, and shipped it as Caribbean-style rum — the world still believes it was always Caribbean. The Classic Malts and Johnnie Walker Blue Label date from his years running United Distillers' North America business, and so does The Keepers of the Quaich, the whisky society he created in 1988 whose guests of honour have included King Charles III, Ronald Reagan and F.W. de Klerk.</p>
<h2>The Chivas play</h2>
<p>Joining Seagram in 1992 as president of the Chivas Regal and Glenlivet group, he set one condition: $100 million, largely on stock, so that Chivas Bros could grow from under two million cases to five million within twenty-five years. Ninety for whisky to sleep in barrels, ten for the distilleries and Linn House, a hospitality home for the trade. Seagram's president wrote later that he nearly fell over. He signed anyway.</p>
<p>Then Espey put on the kilt of the Keepers, went on Chinese television holding a bottle of Chivas Regal, and told a country just coming into money to drink better. Chivas became the top whisky in China. The five-million-case mark was passed some twenty years after he left the company, exactly as the 1992 paper had planned. In 1997 he put Chivas Regal 18 on the shelf — today the No. 1 eighteen-year-old whisky in the world.</p>
<h2>Retired. Three exclamation marks.</h2>
<p>His CV gives 2008 a single line — "Retired ! ! !" — and nobody believed the punctuation. In 2003 he had backed two young men launching an email-security company called Mimecast at his dining-room table. It floated on NASDAQ in 2016 at $10 a share and was acquired by Permira in 2022 at $80 — $5.6 billion. The year he "retired" he founded The Last Drop Distillers, financed from savings, flying economy while hosting dinners in the kilt; Sazerac bought it in 2016 and keeps it at the top of the portfolio.</p>
<p>The OBE for services to the whisky industry came in 2013. The Espey scholarship at his old school in Cape Town has a written criterion: poor, likes sport, reasonably bright — his own file, in other words. In Livingstone he pays the school fees of two girls, and bought one a bicycle so she rides to school instead of walking an hour each way.</p>
<p>Retirement, on this file, is the chairmanship of a start-up whisky distillery twelve miles from Stonehenge, accepted in June 2022 as "an interesting seven-year challenge." By his own arithmetic the brands he built or remade have earned more than £5 billion for Diageo, delivered £10 billion of brand value to the UK economy, and count ten thousand jobs against the career. He is eighty-three. The casks still have to rest. Stock still going down.</p>`,
  },
  {
    issueSlug: "joan",
    title: "Joan Gillman: Forty-Four Years of Making Room for Wonder",
    dek: "From a blackboard at St. Angela Merici in 1982 to a SmartBoard at The Browning School, the science teacher who never changed the subject — only the tools.",
    excerpt:
      "Named Top Educator of the Decade 2026, Joan Gillman has taught science for forty-four years and still runs the K-8 Green Team. The tools kept changing. The subject never did.",
    coverImage: "/issues/joan/wide.jpg",
    coverCaption: "Joan Gillman, photographed for The September Issue.",
    tags: ["The September Issue", "Education", "Women in Business", "Digital Magazine"],
    pullQuote: {
      text: "Give each child an opportunity to shine, and never give up on the goals you hold for them.",
      attribution: "Joan Gillman",
    },
    content: `<p>Long before anyone gave her a laboratory, Joan Gillman was mixing powders in the bathroom, sure that a new product would come of it if she only kept going. Forty-four years of teaching later, the habit has a name she uses without embarrassment: making room for wonder.</p>
<p>Her first classroom, in 1982 at St. Angela Merici School, held a blackboard and a box of chalk, and it was everything she needed. When the first computer arrived she could not find the switch to turn it on. The same hands now run a SmartBoard without a second thought. Today, at The Browning School in New York, she teaches kindergarten, second and fourth grade across three platforms at once, and still runs the K-8 Green Team.</p>
<h2>Before the first classroom</h2>
<p>The scientist arrived first. As a child she held a yardstick to falling snow and built robots from shoe boxes; with her older brother she laid out a model town, Kinderkamack Village. Nobody called any of that a curriculum. It was one anyway. In high school she taught recorder, tutored in math, organized playground games so that every student took part, and taught swimming at the local JCC, including children with special needs.</p>
<p>The proof came during her student teaching at P.S. 47, the junior high school for the deaf, where seventh, eighth and ninth graders built a working amusement park — rides and all. She has been biased toward making things ever since. Her case is a patient one: a child who builds a thing and then teaches it has learned it for good. Students hold a topic longer when they build it, sing it, run it, or teach it to somebody who does not understand it yet.</p>
<h2>Green Action of the Week</h2>
<p>The Green Team decides the Green Action of the Week and posts the signs on each floor. Lights off when you leave the room. Use both sides of the paper. Recycling sorted correctly. A rule a child wrote is a rule a child keeps.</p>
<p>After Hurricane Melissa the team manned a table in the first-floor lobby Monday through Thursday and ran a bake sale on Friday. The week raised $2,300.32 for Project Hope and American Friends of Jamaica. The school kept none of it. Earlier they had raised more than a thousand dollars for water.org, and they still turn up for Central Park cleanups at half past seven on a Monday morning. She teaches climate without frightening the children, because fear does not build a steward — a repeated, finishable task does.</p>
<h2>The circuit and the record</h2>
<p>She is a Subject Area Representative for STANYS for Elementary Science in NYC and has led workshops at STANYS, NSTA, STEMTeachersNYC, SCONYC and NYSAIS. Her piece "Straw Rockets are Out of This World" was published in the NSTA journal Science and Children, then selected for the book Bringing STEM to the Elementary Classroom.</p>
<p>The honors caught up in 2025 and 2026: Top Educator of the Decade 2026, Woman of the Year and a Lifetime Achievement award from the IAOTP. She would rather talk about the room. Listen first. Keep a sense of humor on the hard days. Ask for help, because the building is full of teachers, none of them finished learning either. Artificial intelligence is in the room now too — welcome where it helps, set aside where it would do a child's growing for them. This past year the science labs pulled the technology back, and paper and pencil returned to the bench.</p>
<p>Forty-four Septembers in the same subject. The tools kept changing. The subject never did.</p>`,
  },
  {
    issueSlug: "nichole",
    title: "Dr. Nichole Pettway: Where You Have Been Does Not Decide Where You Are Going",
    dek: "Trauma, addiction, incarceration — then the table where decisions are made. The Deputy Director at BOSS California on lived experience as professional expertise.",
    excerpt:
      "Dr. Nichole Pettway runs the Wellness Empowerment Resiliency Campus, the Trauma Recovery Center, and the Pre-trial Expansion Program. Her qualification began as her own case file.",
    coverImage: "/issues/nichole/wide.jpg",
    coverCaption: "Dr. Nichole Pettway, photographed for The September Issue. The book on the table is hers.",
    tags: ["The September Issue", "Leadership", "Women in Business", "Digital Magazine"],
    pullQuote: {
      text: "Get back up. Sometimes slowly. Sometimes differently. Get back up nonetheless.",
      attribution: "Dr. Nichole Pettway",
    },
    content: `<p>Dr. Nichole Pettway is Deputy Director at Building Opportunities for Self-Sufficiency, California. The Wellness Empowerment Resiliency Campus is one facility; she also manages the Trauma Recovery Center and the Pre-trial Expansion Program. The career was not invented in a classroom. It came from her own file: trauma, addiction, incarceration, instability, and the feeling that a future had already been decided for her.</p>
<p>She also knows what it feels like when someone sees past those circumstances and reminds you the life still has purpose. She wanted to become that person for others — to help people recognize that where they have been does not have to determine where they are going.</p>
<h2>Come as you are</h2>
<p>WERC, she says, is hope, healing, opportunity, and transformation. A room people can arrive in as they are, and be supported in becoming who they were created to be. Pathways for people who have been overlooked, underserved, or defined by their most difficult moments.</p>
<p>Change comes from meeting people where they are. Someone may need employment help and also be carrying trauma, housing instability, justice-system involvement, family trouble, or a behavioral health need. Services, relationships, resources, and opportunity are brought to the same table. Stability and self-sufficiency are the direction of travel.</p>
<p>One of the greatest challenges, she says, is the lack of equitable access to opportunity. Too many people are asked to overcome trauma, poverty, incarceration, violence, homelessness, and systemic barriers without the means. You cannot tell someone to change a life while denying housing, employment, behavioral health, education, and community support.</p>
<h2>Resilience, as she defines it</h2>
<p>Resilience is not pretending that something did not hurt you. It is acknowledging what happened, learning from it, healing from it, and refusing to let it have the final word over your life. Get back up. Sometimes slowly. Sometimes differently. Get back up nonetheless.</p>
<p>Her advice, if the season is still painful: do not make permanent conclusions about a life from a painful season. Give yourself permission to ask for help, to heal, and to take recovery one step at a time. Trauma may become part of the story. It does not have to become the identity. There is life on the other side of what you are in, even when you cannot see it yet.</p>
<h2>What she counts</h2>
<p>She does not count a title, a degree, an award, or a chair as the achievement. She counts sitting at the tables where decisions are made and not forgetting the people those decisions land on. Lived experience became professional expertise. She builds programs, leads teams, creates opportunity, and argues for communities she once personally represented. Her book, Against All Odds, sits on the table in the September sitting — we did not invent a chapter around it.</p>
<p>What is ahead: leadership, speaking, coaching, program development, and Building Bridges Foundation. More opportunity for people marked by trauma, incarceration, addiction, violence, and systemic barriers. Future leaders who can carry the work. Everything she builds, she wants to outlive her.</p>
<p>Her note to the reader: your circumstances do not get to have the final say. You can survive difficult things and still become something you did not expect. Sometimes the experiences you wished you could erase are the ones that equip you to change someone else's life.</p>`,
  },
  {
    issueSlug: "kohila",
    title: "Kohila Sivas: Readiness Before Performance",
    dek: "Why do capable people stay stuck? The founder of Wholistic SuccessCodes built two decades of coaching on a single order of operations — and a question the systems around her never asked.",
    excerpt:
      "From a crisis at twelve to the Blocks to Flow method and a TEDx stage in Spoleto: Kohila Sivas on why nothing works until the human system is ready.",
    coverImage: "/issues/kohila/wide.jpg",
    coverCaption: "Kohila Sivas on stage — the work in the room.",
    tags: ["The September Issue", "Coaching", "Women in Business", "Digital Magazine"],
    pullQuote: {
      text: "Learning challenges are rarely just about learning. There is always something underneath.",
      attribution: "Kohila Sivas",
    },
    content: `<p>Every discipline has a question it cannot stop asking. Kohila Sivas found hers early, and in twenty years it has not moved: why do intelligent, capable people struggle even when they know exactly what to do? She watched students take more tutoring and stay exactly where they were. Parents collected strategy after strategy. Educators burned out. Founders held the plan and could not execute it.</p>
<p>The industry answer is more input — another programme, another planner, another round of discipline. Her answer is different. The visible problem is rarely the real one. A strategy can be excellent and still fail, because the human system it lands on is not ready to use it. The fault is not in the plan. It is in what the plan was asked to sit on.</p>
<h2>The question under the result</h2>
<p>She earned that reading the hard way. At twelve she reached the point of attempting to take her own life. She was not incapable, and she was not a problem child. She was a person struggling inside systems that had no language for what sat underneath the behaviour and the marks. The adults graded the surface. Nobody asked what the surface was standing on.</p>
<p>So she stopped asking what is wrong with a person, and started asking what is blocking them. The first question makes the person the fault. The second makes the block the object of the work. A missed target is data about a system, never a verdict on a person. The score is where most people start. She starts underneath it.</p>
<h2>Blocks to Flow</h2>
<p>Her method starts from a different question: not how do I make this person perform, but what is preventing them from reaching their own capacity right now. Most people arrive convinced they need more discipline, more motivation, more information. Usually they need none of it. They need the block to be seen.</p>
<p>People mistake their blocks for identity — I am lazy, I am bad at math, I procrastinate. She does not take the sentence as the fact. What happened before it, what is the pattern protecting, and what is the behaviour trying to say? A child who stops trying is not showing an absence of ability. A founder who stalls is not showing an absence of ambition. Both are showing where the system stopped feeling safe enough to move.</p>
<p>In practice the method looks less like motivation and more like detective work. She traces the moment a person shuts down, the condition that precedes it, and the quiet logic the pattern is running. Name that, and the fix is rarely dramatic — a block lifted rather than a will overpowered. Once the block is named, shame decreases and choice increases. That is what she means by flow. It is not a personality some people are born with. It is what any system does when nothing is standing in its way.</p>
<h2>The record, and the ripple</h2>
<p>Two decades of the work now has names: Blocks to Flow, the ReadinessOS programs aimed at the barrier underneath the result, and Compass &amp; Campus, the wider platform and marketplace built with other educators. On 9 January 2027 she takes the argument to the TEDx stage in Spoleto, Italy: Readiness Precedes Performance.</p>
<p>The destination is deliberately outsized — one and a half billion lives touched by 2035. Not from a stage, she says: one educator reaches hundreds, one parent changes a family. A ripple. The biggest lesson of more than twenty years is the simplest to say. Push the result without finding the block and you create more resistance, not less. Readiness is not permission to wait. It is the discipline to find the real obstacle before spending the effort. Nothing works until the human system is ready.</p>`,
  },
  {
    issueSlug: "pallavi",
    title: "Pallavi Pande: Twenty Million Plates Later",
    dek: "Banana leaves at home in India, a party sink in Portland, and ten years of supply chain in between. How a question that refused to drain away became DTOCS — and twenty million single-use pieces taken off the table.",
    excerpt:
      "Pallavi Pande turned a plate problem into two companies: palm leaf tableware sold to five hundred caterers and vineyards, and a consulting firm offering the Amazon education she paid for once.",
    coverImage: "/issues/pallavi/wide.jpg",
    coverCaption: "Pallavi Pande, photographed in Portland for The September Issue.",
    tags: ["The September Issue", "Founders", "Women in Business", "Digital Magazine"],
    pullQuote: {
      text: "Working harder does not always fix the problem. The market grades what sells, not effort.",
      attribution: "Pallavi Pande",
    },
    content: `<p>In the house she grew up in, a plate was not a purchase. A banana leaf came to the table, held a full meal, and left again — used once and gone, with nothing behind it that a landfill would ever have to carry. Nobody called it sustainability. It was simply how a meal ended, and it took moving across the world for Pallavi Pande to notice how rare that ending is.</p>
<p>The United States taught her the alternative one party at a time. She ended each night at the sink with the dishes, or guilty about the bag headed for landfill. "Why am I the Chief Dishwashing Officer, or the reason for another bag of waste?" The joke stuck; the question refused to leave.</p>
<h2>Ten years of freight</h2>
<p>She was not guessing at an answer. Before a plate ever carried her name she had spent ten years in supply chain, reading freight and learning where a margin quietly dies. Put the leaf and the logistics together and DTOCS follows almost by itself: palm leaf and bamboo fiber tableware, built for events and foodservice, sold first on Amazon.</p>
<p>Amazon was the classroom and the tuition was real. Pricing, packaging, the catalog, the reviews, the returns, and the difference between a product people like and a product people reorder. There was no template, so she kept each lesson, even the ones that cost real money. Seven years later, the count stands at more than twenty million single-use pieces taken off events and foodservice, across more than five hundred caterers, venues and vineyards.</p>
<h2>A second company</h2>
<p>DTOCS Consulting began as conversation, when other founders kept asking how she sold on Amazon and what she would avoid the second time. The second firm offers the education she paid for once, with the scars still attached. Her favorite receipt is a plate that never shipped: hearts, until the customer survey said square. Working harder does not always fix the problem. The market grades what sells, not effort.</p>
<p>The shelf has filled on its own along the way — the U.S. Chamber CO-100, one of America's Top 100 Small Businesses; Inc. 250 Female Founders; a Gold Stevie. She does not lead with any of it, and the real mark, she says, is simpler: the business is still growing.</p>
<h2>The desk she runs</h2>
<p>Her management style would fit on an index card. She is direct. She does not build complicated rules so that people feel corporate. She wants a team that knows what the company is trying to accomplish, has the freedom to do the work, and feels comfortable saying that something is not working. Mistakes get the same treatment as freight: find what happened, fix it, stop it recurring. She expects responsibility rather than perfection, and holds herself to the standard first.</p>
<p>Motherhood, she says, made her better at the one skill founders rarely name: deciding what actually needs to happen today. Being busy is not being productive; a day can fill itself with things that move nothing. So the question gets asked every morning, of the business and of herself, and the guilt about not doing everything perfectly has been retired. Some days the company needs her, some days her family does, and some days both at once. The plan bends. The outcome does not.</p>
<p>A plate is a small thing. Count again.</p>`,
  },
];

async function main() {
  console.log("Connecting to MongoDB…");
  await dbConnect();

  // Ensure the Magazine category exists
  let category = await Category.findOne({ slug: "magazine" });
  if (!category) {
    category = await Category.create({
      name: "Magazine",
      slug: "magazine",
      kicker: "The September Issue",
      description:
        "Feature stories from the PrimeCrest digital magazine — the leaders, founders, and educators on this year's covers.",
      order: 90,
      seoTitle: "Magazine — PrimeCrest",
      seoDescription:
        "Feature stories from the PrimeCrest digital magazine issues.",
    });
    console.log("Created Magazine category.");
  }

  const articlesSection = await Category.findOne({ slug: "affairs" });
  const sectionIds = [category._id, articlesSection?._id].filter(Boolean);

  const author = await User.findOne({ role: "admin" }) || await User.findOne();
  if (!author) throw new Error("No users found — run the main seed first.");

  const issueBySlug = new Map(MAGAZINE_ISSUES.map((i) => [i.slug, i]));
  const now = Date.now();

  for (const [idx, a] of ARTICLES.entries()) {
    const issue = issueBySlug.get(a.issueSlug)!;
    const publishedAt = new Date(now - idx * 3600 * 1000 - 2 * 3600 * 1000);
    await Article.findOneAndUpdate(
      { slug: issue.articleSlug },
      {
        $set: {
          title: a.title,
          slug: issue.articleSlug,
          dek: a.dek,
          excerpt: a.excerpt,
          content: a.content,
          coverImage: a.coverImage,
          coverCaption: a.coverCaption,
          coverCredit: "Photograph for PrimeCrest",
          ogImage: issue.cover,
          category: category._id,
          categories: sectionIds,
          tags: a.tags,
          author: author._id,
          status: "published",
          featured: true,
          format: "feature",
          allowAds: true,
          seoDescription: a.excerpt,
          readTime: readingTime(a.content),
          magazineUrl: issue.magazineUrl,
          pullQuote: a.pullQuote,
        },
        $setOnInsert: { publishedAt, views: Math.floor(Math.random() * 2000) + 400 },
      },
      { upsert: true, new: true },
    );
    console.log(`Upserted: ${issue.articleSlug}`);
  }

  console.log(`\nDone. ${ARTICLES.length} magazine articles published.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
