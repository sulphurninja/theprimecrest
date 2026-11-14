import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard, type CardArticle } from "@/components/site/ArticleCard";
import { SectionTitle } from "@/components/site/SectionHead";
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

  const socials = [
    { label: "X", url: author.socials?.twitter },
    { label: "LinkedIn", url: author.socials?.linkedin },
  ].filter((social) => social.url);

  return (
    <div>
      <header className="border-b border-ink">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 px-4 pb-12 pt-14 sm:flex-row sm:items-center sm:px-6 lg:pt-20">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={128}
              height={128}
              className="h-28 w-28 shrink-0 rounded-full object-cover shadow-[0_18px_40px_-18px_rgba(14,14,16,0.5)] sm:h-32 sm:w-32"
            />
          ) : null}
          <div>
            <p className="label !tracking-[0.28em] text-ink">{author.title || "Contributor"}</p>
            <h1 className="display-caps mt-4 text-[2.6rem] sm:text-[3.6rem]">{author.name}</h1>
            {author.bio ? (
              <p className="mt-4 max-w-2xl font-serif text-[1.1rem] leading-relaxed text-ink-soft">{author.bio}</p>
            ) : null}
            {socials.length ? (
              <div className="mt-5 flex gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline !px-4 !py-2"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
        <SectionTitle title={`${articles.length} ${articles.length === 1 ? "story" : "stories"}`} />
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} variant="feature" />
          ))}
        </div>
      </section>
    </div>
  );
}
