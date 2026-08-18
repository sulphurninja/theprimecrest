import Image from "next/image";
import Link from "next/link";

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
  return (
    <p className={`meta ${className}`}>
      {article.author?.name ? (
        <>
          By <span className="font-medium text-ink-soft">{article.author.name}</span>
        </>
      ) : null}
      {article.readTime ? <> · {article.readTime} min read</> : null}
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
      <article className="group border-b border-rule py-4 first:pt-0 last:border-b-0">
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
      <article className="grid grid-cols-[1fr_96px] items-start gap-4 border-b border-rule py-4 last:border-b-0">
        <div>
          <Kicker article={article} />
          <h3 className="headline mt-1 text-[1.05rem] leading-snug">
            <Link href={href}>{article.title}</Link>
          </h3>
          <Byline article={article} className="mt-1.5" />
        </div>
        {article.coverImage ? (
          <Link href={href} className="img-hover relative block aspect-square bg-paper-2">
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
          <Link href={href} className="img-hover relative block aspect-[16/9] bg-paper-2">
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
          <h1 className="headline mt-2 text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]">
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
      <article className="grid items-center gap-8 lg:grid-cols-5 lg:gap-14">
        {article.coverImage ? (
          <Link
            href={href}
            className="img-hover relative block aspect-[4/3] bg-paper-2 lg:col-span-3"
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
          <p className="kicker">
            The Cover Story{article.category?.name ? ` · ${article.category.name}` : ""}
          </p>
          <h2 className="headline mt-3 text-[1.9rem] sm:text-[2.4rem]">
            <Link href={href}>{article.title}</Link>
          </h2>
          {article.dek ? <p className="dek mt-4">{article.dek}</p> : null}
          <Byline article={article} className="mt-4" />
          <Link
            href={href}
            className="mt-6 inline-block font-sans text-[0.82rem] font-semibold text-accent no-underline hover:text-accent-hover"
          >
            Read the story →
          </Link>
        </div>
      </article>
    );
  }

  /* Grid card with image on top. */
  if (variant === "feature") {
    return (
      <article>
        {article.coverImage ? (
          <Link href={href} className="img-hover relative mb-4 block aspect-[3/2] bg-paper-2">
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
        <h3 className="headline mt-1.5 text-[1.35rem]">
          <Link href={href}>{article.title}</Link>
        </h3>
        {article.excerpt ? (
          <p className="mt-2 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>
        ) : null}
        <Byline article={article} className="mt-3" />
      </article>
    );
  }

  /* Standard horizontal card. */
  return (
    <article className="grid gap-5 sm:grid-cols-[5fr_4fr] sm:items-start">
      {article.coverImage ? (
        <Link href={href} className="img-hover relative block aspect-[3/2] bg-paper-2">
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
        <h3 className="headline mt-1.5 text-[1.5rem]">
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
