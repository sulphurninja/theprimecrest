"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBackIcon, ArrowIcon, IssueIcon } from "@/components/site/Icons";
import { MAGAZINE_ISSUES, issueLabel } from "@/lib/magazines";
import type { CardArticle } from "./ArticleCard";

interface HeroCarouselProps {
  articles: CardArticle[];
  interval?: number;
}

const issueBySlug = new Map(MAGAZINE_ISSUES.map((issue) => [issue.articleSlug, issue]));

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial cover: the lead photograph beside its headline and standfirst,
 * with the other cover stories as a row of cards underneath. It rotates on
 * its own; any card can be picked.
 */
export function HeroCarousel({ articles, interval = 7000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (index: number) => setCurrent((index + articles.length) % articles.length),
    [articles.length],
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [isPaused, next, interval, articles.length]);

  if (!articles.length) return null;

  const article = articles[current];
  const issue = issueBySlug.get(article.slug);
  const label = (a: CardArticle) => {
    const i = issueBySlug.get(a.slug);
    return i ? issueLabel(i) : a.category?.name || "";
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Cover stories"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Photograph */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-2 lg:col-span-7 lg:aspect-[5/4]"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current !== null) {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (dx < -40) next();
              else if (dx > 40) prev();
            }
            touchX.current = null;
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={article._id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.7, ease: "easeOut" },
                scale: { duration: interval / 1000 + 1, ease: "linear" },
              }}
            >
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority={current === 0}
                  className="object-cover"
                  sizes="(min-width: 1024px) 760px, 100vw"
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
          <Link href={`/story/${article.slug}`} className="absolute inset-0" aria-label={article.title} />
          {issue ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.a
                key={issue.slug}
                href={issue.magazineUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease }}
                className="absolute bottom-5 right-5 hidden w-[104px] overflow-hidden rounded-[3px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)] ring-1 ring-white/20 transition-transform hover:-translate-y-1 sm:block"
                aria-label={`Open the ${issueLabel(issue)} flipbook`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={issue.cover} alt="" className="aspect-[3/4] w-full object-cover" />
              </motion.a>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Headline */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-accent">
                {issue ? "Cover story" : article.category?.name || "Featured"}
                {issue ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-ink/25" aria-hidden />
                    <span className="text-muted">{issueLabel(issue)}</span>
                  </>
                ) : null}
              </p>
              <h1 className="statement mt-4 text-[2.3rem] sm:text-[3rem] lg:text-[3.4rem]">
                <Link href={`/story/${article.slug}`}>{article.title}</Link>
              </h1>
              {article.dek ? (
                <p className="mt-5 font-serif text-[1.12rem] leading-relaxed text-ink-soft line-clamp-4">
                  {article.dek}
                </p>
              ) : null}
              {issue ? (
                <p className="mt-5 font-sans text-[0.86rem] text-muted">
                  <span className="font-semibold text-ink">{issue.name}</span> · {issue.role}
                </p>
              ) : article.author?.name ? (
                <p className="mt-5 font-sans text-[0.86rem] text-muted">
                  By <span className="font-semibold text-ink">{article.author.name}</span>
                  {article.readTime ? ` · ${article.readTime} min read` : ""}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={`/story/${article.slug}`} className="btn-primary group">
                  Read the story
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                {issue ? (
                  <a href={issue.magazineUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <IssueIcon className="h-4 w-4" /> Flipbook
                  </a>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Other cover stories */}
      {articles.length > 1 ? (
        <div className="mt-10 border-t border-ink/10 pt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="label text-muted">More cover stories</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                aria-label="Previous story"
              >
                <ArrowBackIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                aria-label="Next story"
              >
                <ArrowIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="scrollbar-none -mx-4 flex snap-x gap-5 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0">
            {articles.map((a, i) => {
              const active = i === current;
              return (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={active ? "true" : undefined}
                  aria-label={`Show story: ${a.title}`}
                  className="group flex w-[170px] shrink-0 snap-start flex-col self-start text-left lg:w-auto"
                >
                  <span
                    className={`relative block aspect-[4/3] overflow-hidden rounded-md bg-paper-2 transition-opacity ${
                      active ? "" : "opacity-70 group-hover:opacity-100"
                    }`}
                  >
                    {a.coverImage ? (
                      <Image src={a.coverImage} alt="" fill className="object-cover" sizes="180px" />
                    ) : null}
                  </span>
                  <span className="relative mt-3 block h-[2px] overflow-hidden bg-ink/10">
                    {active ? (
                      isPaused ? (
                        <span className="block h-full w-full bg-accent" />
                      ) : (
                        <motion.span
                          key={`progress-${current}`}
                          className="block h-full bg-accent"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: interval / 1000, ease: "linear" }}
                        />
                      )
                    ) : null}
                  </span>
                  <span className={`label mt-2.5 block !text-[0.6rem] ${active ? "text-accent" : "text-muted"}`}>
                    {label(a)}
                  </span>
                  <span
                    className={`mt-1 block font-sans text-[0.86rem] font-semibold leading-snug line-clamp-2 ${
                      active ? "text-ink" : "text-ink-soft group-hover:text-ink"
                    }`}
                  >
                    {a.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
