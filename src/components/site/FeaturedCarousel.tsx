"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CardArticle } from "@/components/site/ArticleCard";

const ADVANCE_MS = 7000;

export function FeaturedCarousel({ articles }: { articles: CardArticle[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = articles.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), ADVANCE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  if (!count) return null;

  return (
    <section
      className="group/carousel relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured stories"
    >
      {/* Slides — stacked, crossfading */}
      <div className="relative">
        {articles.map((article, i) => {
          const active = i === index;
          return (
            <article
              key={article._id}
              className={`transition-opacity duration-700 ease-out ${
                active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-0 opacity-0"
              }`}
              aria-hidden={!active}
            >
              {article.coverImage ? (
                <Link
                  href={`/story/${article.slug}`}
                  className="img-hover relative block aspect-[16/9] bg-paper-2"
                  tabIndex={active ? 0 : -1}
                >
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    priority={i === 0}
                    className="object-cover"
                    sizes="(min-width: 1024px) 800px, 100vw"
                  />
                </Link>
              ) : null}
              <div className="mt-5">
                {article.category?.name ? (
                  <Link
                    href={`/c/${article.category.slug}`}
                    className="kicker no-underline"
                    tabIndex={active ? 0 : -1}
                  >
                    {article.category.name}
                  </Link>
                ) : null}
                <h1 className="headline mt-2 text-[1.9rem] sm:text-[2.6rem] lg:text-[3rem]">
                  <Link href={`/story/${article.slug}`} tabIndex={active ? 0 : -1}>
                    {article.title}
                  </Link>
                </h1>
                {article.dek ? (
                  <p className="dek mt-4 max-w-2xl text-[1.15rem]">{article.dek}</p>
                ) : null}
                <p className="meta mt-4">
                  {article.author?.name ? (
                    <>
                      By <span className="font-medium text-ink-soft">{article.author.name}</span>
                    </>
                  ) : null}
                  {article.readTime ? <> · {article.readTime} min read</> : null}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Controls */}
      {count > 1 ? (
        <div className="mt-6 flex items-center gap-4">
          {/* Progress bars */}
          <div className="flex flex-1 items-center gap-1.5">
            {articles.map((a, i) => (
              <button
                key={a._id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to story ${i + 1} of ${count}`}
                className="group/bar flex-1 py-2"
              >
                <span className="block h-[2px] w-full overflow-hidden rounded-full bg-rule transition-colors group-hover/bar:bg-muted">
                  <span
                    className={`block h-full origin-left bg-ink ${
                      i === index
                        ? paused
                          ? "w-full"
                          : "carousel-progress"
                        : i < index
                          ? "w-full opacity-30"
                          : "w-0"
                    }`}
                    style={i === index && !paused ? { animationDuration: `${ADVANCE_MS}ms` } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>

          <span className="font-sans text-[0.72rem] tabular-nums text-muted">
            {index + 1} / {count}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous story"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-rule text-ink-soft transition-all hover:border-ink hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next story"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-rule text-ink-soft transition-all hover:border-ink hover:text-ink"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
