"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBackIcon, ArrowIcon } from "@/components/site/Icons";
import { MAGAZINE_ISSUES, issueLabel } from "@/lib/magazines";
import { formatDate } from "@/lib/utils";
import type { CardArticle } from "./ArticleCard";

interface HeroCarouselProps {
  articles: CardArticle[];
  /** Stories for the "Must Read" panel beside the lead. */
  mustRead?: CardArticle[];
  interval?: number;
}

const issueBySlug = new Map(MAGAZINE_ISSUES.map((issue) => [issue.articleSlug, issue]));

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Front-page lead: a full-height photograph with the headline set over it,
 * rotating through the cover stories, joined to a "Must Read" panel.
 */
export function HeroCarousel({ articles, mustRead = [], interval = 7000 }: HeroCarouselProps) {
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
  const panel = mustRead.filter((a) => a._id !== article._id).slice(0, 4);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12" aria-label="Cover stories">
      {/* Lead */}
      <div
        className="relative min-h-[520px] overflow-hidden bg-ink text-white sm:min-h-[560px] lg:col-span-8 lg:min-h-[640px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setIsPaused(true);
        }}
        onTouchEnd={(e) => {
          if (touchX.current !== null) {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -40) next();
            else if (dx > 40) prev();
          }
          touchX.current = null;
          setIsPaused(false);
        }}
        aria-roledescription="carousel"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={article._id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut" },
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
                sizes="(min-width: 1024px) 880px, 100vw"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Link href={`/story/${article.slug}`} className="absolute inset-0" aria-label={article.title} />

        <div className="pointer-events-none relative flex h-full min-h-[inherit] flex-col justify-end p-6 pb-24 sm:p-10 sm:pb-24 lg:p-14 lg:pb-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
              className="pointer-events-auto max-w-[720px]"
            >
              <p className="flex flex-wrap items-center gap-3">
                <span className="bg-accent px-2.5 py-1 font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white">
                  {issue ? "Cover story" : article.category?.name || "Featured"}
                </span>
                <span className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white/80">
                  {issue ? issueLabel(issue) : formatDate(article.publishedAt)}
                </span>
              </p>
              <h1 className="statement mt-5 text-[2.2rem] text-white sm:text-[2.9rem] lg:text-[3.5rem]">
                <Link href={`/story/${article.slug}`}>{article.title}</Link>
              </h1>
              {article.dek ? (
                <p className="mt-5 max-w-[620px] text-[1.05rem] leading-relaxed text-white/80 line-clamp-3">
                  {article.dek}
                </p>
              ) : null}
              <Link href={`/story/${article.slug}`} className="read-more mt-7 text-white">
                Read the story »
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        {articles.length > 1 ? (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-5 px-6 pb-7 sm:px-10 lg:px-14">
            <div className="flex flex-1 gap-1.5">
              {articles.map((a, i) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => go(i)}
                  className="group/seg flex-1 py-2"
                  aria-label={`Story ${i + 1}: ${a.title}`}
                  aria-current={i === current ? "true" : undefined}
                >
                  <span className="block h-[3px] overflow-hidden bg-white/25 transition-colors group-hover/seg:bg-white/50">
                    {i === current ? (
                      isPaused ? (
                        <span className="block h-full w-full bg-white" />
                      ) : (
                        <motion.span
                          key={`progress-${current}`}
                          className="block h-full bg-white"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: interval / 1000, ease: "linear" }}
                        />
                      )
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
                aria-label="Previous story"
              >
                <ArrowBackIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
                aria-label="Next story"
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Must Read */}
      {panel.length ? (
        <aside className="bg-night px-6 py-8 text-white sm:px-8 lg:col-span-4">
          <h2 className="font-display text-[1.9rem] font-semibold leading-none">Must Read</h2>
          <span className="mt-4 block h-[3px] w-24 bg-accent" aria-hidden />
          <ul className="mt-7 space-y-4">
            {panel.map((a) => (
              <li key={a._id}>
                <Link
                  href={`/story/${a.slug}`}
                  className="group grid grid-cols-[112px_1fr] items-center gap-4 border border-white/15 p-3 no-underline transition-colors hover:border-white/40 hover:bg-white/[0.04]"
                >
                  <span className="relative block aspect-square overflow-hidden bg-night-3">
                    {a.coverImage ? (
                      <Image
                        src={a.coverImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="112px"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    {a.category?.name ? (
                      <span className="label block !text-[0.6rem] text-gold-soft">{a.category.name}</span>
                    ) : null}
                    <span className="mt-1.5 block font-display text-[1.08rem] font-semibold leading-snug text-white line-clamp-3">
                      {a.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </section>
  );
}
