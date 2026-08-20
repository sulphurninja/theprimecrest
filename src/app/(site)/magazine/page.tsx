import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { getCategoryBySlug, getCategoryArticles } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 120;

export const metadata = buildMetadata({
  title: "Magazine",
  description:
    "In-depth features, long reads, and exclusive stories from the PrimeCrest digital magazine.",
  path: "/magazine",
});

export default async function MagazinePage() {
  const category = await getCategoryBySlug("magazine").catch(() => null);

  let articles: CardArticle[] = [];
  if (category) {
    const result = await getCategoryArticles(String(category._id), 1, 24);
    articles = result.items as CardArticle[];
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
      <header className="border-b-2 border-ink py-12">
        <p className="kicker">The Journal</p>
        <h1 className="headline mt-2 text-[2.6rem] sm:text-[3.4rem]">Magazine</h1>
        <p className="dek mt-4 max-w-2xl">
          In-depth features, long reads, and exclusive stories — curated from the pages of our
          digital magazine.
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-24 text-center">
          <p className="headline text-[1.6rem]">Nothing here yet.</p>
          <p className="mt-3 font-serif text-ink-soft">
            Magazine stories are on their way. Check back soon.
          </p>
        </div>
      ) : (
        <section className="grid gap-x-10 gap-y-12 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} variant="feature" />
          ))}
        </section>
      )}
    </div>
  );
}
