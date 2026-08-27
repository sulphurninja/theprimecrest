"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CardArticle } from "./ArticleCard";

interface HeroCarouselProps {
  articles: CardArticle[];
  interval?: number;
}

export function HeroCarousel({ articles, interval = 5000 }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [isPaused, next, interval, articles.length]);

  if (!articles.length) return null;

  const article = articles[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel area */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={article._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {article.coverImage ? (
              <Link
                href={`/story/${article.slug}`}
                className="img-hover relative mb-5 block aspect-[16/9] bg-paper-2"
              >
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </Link>
            ) : null}
            {article.category?.name ? (
              <Link
                href={`/c/${article.category.slug}`}
                className="kicker no-underline"
              >
                {article.category.name}
              </Link>
            ) : null}
            <h1 className="headline mt-2 text-[1.8rem] leading-tight sm:text-[2.4rem]">
              <Link href={`/story/${article.slug}`}>{article.title}</Link>
            </h1>
            {article.dek ? (
              <p className="dek mt-3 max-w-xl text-[1.05rem]">{article.dek}</p>
            ) : null}
            <p className="meta mt-3">
              {article.author?.name ? (
                <>
                  By{" "}
                  <span className="font-medium text-ink-soft">
                    {article.author.name}
                  </span>
                </>
              ) : null}
              {article.readTime ? <> · {article.readTime} min read</> : null}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      {articles.length > 1 && (
        <>
          {/* Prev/Next buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-[20%] -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 lg:opacity-60 lg:hover:opacity-100"
            aria-label="Previous article"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-[20%] translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 lg:opacity-60 lg:hover:opacity-100"
            aria-label="Next article"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators + progress bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-1.5">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-accent"
                      : "w-2 bg-ink/20 hover:bg-ink/40"
                  }`}
                  aria-label={`Go to article ${i + 1}`}
                />
              ))}
            </div>
            {/* Auto-rotate progress indicator */}
            {!isPaused && (
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: interval / 1000, ease: "linear" }}
                  key={`progress-${current}`}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
