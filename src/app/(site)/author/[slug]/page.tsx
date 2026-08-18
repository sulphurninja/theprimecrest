import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { getAuthorArticles, getAuthorBySlug } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug).catch(() => null);
  if (!author) return buildMetadata({ title: "Author not found", noIndex: true });
  return buildMetadata({
    title: author.name,
    description: author.bio || `Stories by ${author.name} for PrimeCrest.`,
    path: `/author/${author.slug}`,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug).catch(() => null);
  if (!author) notFound();

  const articles = (await getAuthorArticles(String(author._id)).catch(() => [])) as CardArticle[];

  return (
    <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
      <header className="flex flex-col items-start gap-7 border-b-2 border-ink py-14 sm:flex-row sm:items-center">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-full object-cover"
          />
        ) : null}
        <div>
          <p className="kicker">{author.title || "Contributor"}</p>
          <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">{author.name}</h1>
          {author.bio ? <p className="dek mt-4 max-w-2xl">{author.bio}</p> : null}
          <div className="mt-4 flex gap-5">
            {author.socials?.twitter ? (
              <a
                href={author.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-[0.82rem] font-medium text-ink-soft no-underline hover:text-accent"
              >
                X
              </a>
            ) : null}
            {author.socials?.linkedin ? (
              <a
                href={author.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-[0.82rem] font-medium text-ink-soft no-underline hover:text-accent"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className="py-12">
        <p className="meta mb-8">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
        </p>
        <div className="divide-y divide-rule">
          {articles.map((article) => (
            <div key={article._id} className="py-8 first:pt-0">
              <ArticleCard article={article} variant="standard" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
