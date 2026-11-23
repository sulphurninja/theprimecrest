"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBackIcon, ArrowIcon } from "@/components/site/Icons";
import type { MagazineIssue } from "@/lib/magazines";
import type { CardArticle } from "./ArticleCard";

interface HeroCarouselProps {
  articles: CardArticle[];
  /** Stories for the "Must Read" list beside the lead. */
  mustRead?: CardArticle[];
  /** Magazine issues, to tag cover stories. */
  issues?: MagazineIssue[];
  interval?: number;
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Front-page lead: the cover story photograph with its headline set over it,
 * rotating through the cover stories, beside a "Must Read" list.
 */
export function HeroCarousel({ articles, mustRead = [], issues = [], interval = 7000 }: HeroCarouselProps) {
  const issueBySlug = useMemo(() => new Map(issues.map((issue) => [issue.articleSlug, issue])), [issues]);
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
  const isCover = issueBySlug.has(article.slug);
  const panel = mustRead.slice(0, 4);

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10" aria-label="Cover stories">
      {/* Lead */}
      <div
        className="relative min-h-[460px] overflow-hidden bg-brand-dark text-white sm:min-h-[500px] lg:col-span-8 lg:min-h-[540px]"
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
            initial={{ opacity: 0, scale: 1.04 }}
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f1f17]/90 via-[#0f1f17]/55 to-transparent" />
        <Link href={`/story/${article.slug}`} className="absolute inset-0" aria-label={article.title} />

        <div className="pointer-events-none relative flex h-full min-h-[inherit] flex-col justify-center p-7 sm:p-10 lg:p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease }}
              className="pointer-events-auto max-w-[540px]"
            >
              <span className="inline-block bg-gold px-3 py-1 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
                {isCover ? "Cover story" : article.category?.name || "Featured"}
              </span>
              <h1 className="mt-5 font-display text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.015em] text-white sm:text-[2.9rem] lg:text-[3.2rem]">
                <Link href={`/story/${article.slug}`} className="hover:text-gold-soft">
                  {article.title}
                </Link>
              </h1>
              {article.dek ? (
                <p className="mt-4 max-w-[480px] text-[1.02rem] leading-relaxed text-white/85 line-clamp-3">
                  {article.dek}
                </p>
              ) : null}
              <Link href={`/story/${article.slug}`} className="btn-primary group mt-7">
                {isCover ? "Read the cover story" : "Read the story"}
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        {articles.length > 1 ? (
          <div className="absolute bottom-5 right-5 flex items-center gap-3">
            <div className="hidden gap-1.5 sm:flex">
              {articles.map((a, i) => (
                <button
                  key={a._id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Story ${i + 1}: ${a.title}`}
                  aria-current={i === current ? "true" : undefined}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-gold-soft" : "w-2 bg-white/45 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              aria-label="Previous story"
            >
              <ArrowBackIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
              aria-label="Next story"
            >
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      {/* Must Read */}
      {panel.length ? (
        <aside className="lg:col-span-4">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 font-display text-[1.75rem] font-semibold leading-tight text-ink">Must Read</h2>
            <span className="h-px flex-1 bg-gold/60" aria-hidden />
          </div>
          <ul className="divide-y divide-ink/10">
            {panel.map((a) => (
              <li key={a._id} className="py-3.5 first:pt-0">
                <Link href={`/story/${a.slug}`} className="group grid grid-cols-[120px_1fr] items-center gap-4 no-underline">
                  <span className="relative block aspect-[3/2] overflow-hidden bg-paper-2">
                    {a.coverImage ? (
                      <Image
                        src={a.coverImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="120px"
                      />
                    ) : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1.02rem] font-semibold leading-snug text-ink transition-colors line-clamp-2 group-hover:text-gold-deep">
                      {a.title}
                    </span>
                    <span className="mt-1.5 block font-sans text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                      {[a.category?.name, a.readTime ? `${a.readTime} min read` : ""].filter(Boolean).join(" · ")}
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
