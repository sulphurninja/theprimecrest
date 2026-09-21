"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CardArticle } from "./ArticleCard";

interface HeroCarouselProps {
  articles: CardArticle[];
  interval?: number;
}

const textVariants = {
  enter: { opacity: 0, y: 26 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

export function HeroCarousel({ articles, interval = 6000 }: HeroCarouselProps) {
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

  return (
    <div
      className="group/hero relative overflow-hidden bg-ink"
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
    >
      {/* Art */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[560px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={article._id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.7, ease: "easeOut" },
              scale: { duration: 7, ease: "linear" },
            }}
          >
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 900px, 100vw"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Scrims */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        {/* Counter */}
        <div className="absolute right-4 top-4 border border-white/25 bg-black/35 px-2.5 py-1 font-sans text-[0.7rem] font-medium tabular-nums text-white/90 backdrop-blur-sm">
          {String(current + 1).padStart(2, "0")} — {String(articles.length).padStart(2, "0")}
        </div>

        {/* Full-slide click target */}
        <Link
          href={`/story/${article.slug}`}
          className="absolute inset-0"
          aria-label={article.title}
        />

        {/* Copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 pb-16 sm:p-8 sm:pb-16 lg:p-10 lg:pb-[4.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={article._id}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto max-w-[640px]"
            >
              {article.category?.name ? (
                <Link
                  href={`/c/${article.category.slug}`}
                  className="inline-flex items-center gap-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white no-underline"
                >
                  <span className="h-[2px] w-7 bg-accent" aria-hidden />
                  {article.category.name}
                </Link>
              ) : null}
              <h1 className="headline mt-3 text-[1.65rem] leading-[1.08] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-[2.3rem] lg:text-[2.7rem]">
                <Link href={`/story/${article.slug}`} className="no-underline hover:text-white/85">
                  {article.title}
                </Link>
              </h1>
              {article.dek ? (
                <p className="mt-3 hidden max-w-[520px] font-serif text-[1.02rem] leading-relaxed text-white/80 sm:block">
                  {article.dek}
                </p>
              ) : null}
              <p className="mt-3 font-sans text-[0.8rem] text-white/65">
                {article.author?.name ? (
                  <>
                    By <span className="font-medium text-white/90">{article.author.name}</span>
                  </>
                ) : null}
                {article.readTime ? <> · {article.readTime} min read</> : null}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom control bar */}
        {articles.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 px-5 pb-4 sm:px-8 lg:px-10">
            <div className="flex gap-1.5">
              {articles.map((a, i) => (
                <button
                  key={a._id}
                  onClick={() => go(i)}
                  className={`h-[3px] transition-all duration-300 ${
                    i === current ? "w-9 bg-accent" : "w-4 bg-white/35 hover:bg-white/70"
                  }`}
                  aria-label={`Go to story ${i + 1}`}
                  aria-current={i === current ? "true" : undefined}
                />
              ))}
            </div>
            {!isPaused ? (
              <div className="h-[2px] max-w-[160px] flex-1 overflow-hidden bg-white/15">
                <motion.div
                  className="h-full bg-white/60"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: interval / 1000, ease: "linear" }}
                  key={`progress-${current}`}
                />
              </div>
            ) : (
              <div className="h-[2px] max-w-[160px] flex-1 bg-white/15" />
            )}
            <div className="ml-auto flex gap-2">
              <button
                onClick={prev}
                className="flex h-9 w-9 items-center justify-center border border-white/30 text-white/85 backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-ink"
                aria-label="Previous story"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex h-9 w-9 items-center justify-center border border-white/30 text-white/85 backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-ink"
                aria-label="Next story"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
