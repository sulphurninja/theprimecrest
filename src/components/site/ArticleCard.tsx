import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export type CardArticle = {
  _id: string;
  title: string;
  slug: string;
  dek?: string;
  excerpt?: string;
  coverImage?: string;
  coverCredit?: string;
  readTime?: number;
  publishedAt?: string;
  format?: string;
  author?: { name: string; slug: string };
  category?: { name: string; slug: string };
};

function Byline({ article, className = "" }: { article: CardArticle; className?: string }) {
  const parts = [
    article.publishedAt ? formatDate(article.publishedAt, { month: "short" }) : "",
    article.readTime ? `${article.readTime} min read` : "",
  ].filter(Boolean);
  return (
    <p className={`meta ${className}`}>
      {article.author?.name ? (
        <span className="font-medium text-ink-soft">{article.author.name}</span>
      ) : null}
      {article.author?.name && parts.length ? <span className="mx-1.5 text-rule">|</span> : null}
      {parts.join(" · ")}
    </p>
  );
}

function Kicker({ article }: { article: CardArticle }) {
  if (!article.category?.name) return null;
  return (
    <Link href={`/c/${article.category.slug}`} className="kicker no-underline">
      {article.category.name}
    </Link>
  );
}

export function ArticleCard({
  article,
  variant = "standard",
}: {
  article: CardArticle;
  variant?: "hero" | "feature" | "standard" | "compact" | "cover" | "list";
}) {
  const href = `/story/${article.slug}`;

  /* Headline-only row for "latest" rails — hairline separated. */
  if (variant === "compact") {
    return (
      <article className="group border-b border-rule py-5 first:pt-0 last:border-b-0">
        <Kicker article={article} />
        <h3 className="headline mt-1.5 text-[1.15rem] leading-snug">
          <Link href={href}>{article.title}</Link>
        </h3>
        <Byline article={article} className="mt-2" />
      </article>
    );
  }

  /* Thumbnail row for related/most-read lists. */
  if (variant === "list") {
    return (
      <article className="group grid grid-cols-[1fr_96px] items-start gap-4 border-b border-rule py-4 last:border-b-0">
        <div>
          <Kicker article={article} />
          <h3 className="headline mt-1 text-[1.05rem] leading-snug">
            <Link href={href}>{article.title}</Link>
          </h3>
          <Byline article={article} className="mt-1.5" />
        </div>
        {article.coverImage ? (
          <Link href={href} className="img-hover relative block aspect-square overflow-hidden bg-paper-2">
            <Image src={article.coverImage} alt="" fill className="object-cover" sizes="96px" />
          </Link>
        ) : null}
      </article>
    );
  }

  /* Homepage lead story. */
  if (variant === "hero") {
    return (
      <article className="animate-in">
        {article.coverImage ? (
          <Link href={href} className="img-hover relative overflow-hidden block aspect-[16/9] bg-paper-2">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          </Link>
        ) : null}
        {article.coverCredit ? (
          <p className="mt-1.5 text-right font-sans text-[0.7rem] text-muted">
            {article.coverCredit}
          </p>
        ) : null}
        <div className="mt-5">
          <Kicker article={article} />
          <h1 className="statement mt-3 text-[1.9rem] sm:text-[2.3rem] lg:text-[2.5rem]">
            <Link href={href}>{article.title}</Link>
          </h1>
          {article.dek ? <p className="dek mt-4 max-w-2xl text-[1.2rem]">{article.dek}</p> : null}
          <Byline article={article} className="mt-4" />
        </div>
      </article>
    );
  }

  /* Full-width band with image beside text. */
  if (variant === "cover") {
    return (
      <article className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-14">
        {article.coverImage ? (
          <Link
            href={href}
            className="img-hover relative overflow-hidden block aspect-[4/3] bg-paper-2 lg:col-span-3"
          >
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </Link>
        ) : null}
        <div className="lg:col-span-2">
          <p className="eyebrow text-accent">
            The Lead{article.category?.name ? ` · ${article.category.name}` : ""}
          </p>
          <h2 className="statement mt-4 text-[1.9rem] sm:text-[2.4rem]">
            <Link href={href}>{article.title}</Link>
          </h2>
          {article.dek ? <p className="dek mt-4">{article.dek}</p> : null}
          <Byline article={article} className="mt-4" />
          <Link href={href} className="btn-outline mt-7 no-underline">
            <span>Read the story →</span>
          </Link>
        </div>
      </article>
    );
  }

  /* Grid card with image on top. */
  if (variant === "feature") {
    return (
      <article className="group">
        {article.coverImage ? (
          <Link href={href} className="img-hover relative overflow-hidden mb-5 block aspect-[3/2] bg-paper-2">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 30vw, 100vw"
            />
          </Link>
        ) : null}
        <Kicker article={article} />
        <h3 className="headline mt-2 text-[1.25rem] leading-[1.22]">
          <Link href={href}>{article.title}</Link>
        </h3>
        {article.excerpt ? (
          <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft line-clamp-3">
            {article.excerpt}
          </p>
        ) : null}
        <Byline article={article} className="mt-3" />
        <Link href={href} className="read-more mt-4 text-ink">
          Read more »
        </Link>
      </article>
    );
  }

  /* Standard horizontal card. */
  return (
    <article className="group grid grid-cols-1 gap-6 sm:grid-cols-[5fr_4fr] sm:items-center">
      {article.coverImage ? (
        <Link href={href} className="img-hover relative overflow-hidden block aspect-[3/2] bg-paper-2">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 45vw, 100vw"
          />
        </Link>
      ) : null}
      <div>
        <Kicker article={article} />
        <h3 className="statement mt-3 text-[1.7rem] sm:text-[2.1rem]">
          <Link href={href}>{article.title}</Link>
        </h3>
        {article.dek || article.excerpt ? (
          <p className="mt-2.5 font-serif text-[0.98rem] leading-relaxed text-ink-soft">
            {article.dek || article.excerpt}
          </p>
        ) : null}
        <Byline article={article} className="mt-3" />
      </div>
    </article>
  );
}
