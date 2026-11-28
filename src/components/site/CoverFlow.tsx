"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowBackIcon, ArrowIcon } from "@/components/site/Icons";
import type { MagazineIssue } from "@/lib/magazines";

const ease = [0.16, 1, 0.3, 1] as const;

/** Shortest signed distance from the active cover, so the ring wraps both ways. */
function offset(index: number, current: number, count: number) {
  let d = index - current;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

/**
 * Front-page hero: the latest editions as a 3D cover carousel. The centre
 * cover faces the reader; its neighbours turn in towards it and step back.
 * Slide with the arrows, the keyboard, a swipe or a drag, or click a side
 * cover. The panel on the left follows the cover in front.
 */
export function CoverFlow({ issues, interval = 6000 }: { issues: MagazineIssue[]; interval?: number }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef<number | null>(null);
  const dragged = useRef(false);
  const count = issues.length;

  const go = useCallback((index: number) => setCurrent(((index % count) + count) % count), [count]);
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (paused || count <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [paused, next, interval, count]);

  if (!count) return null;
  const active = issues[current];

  return (
    <section
      aria-label="Latest editions"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_75%_40%,#fbf6ea_0%,#f1e6cf_55%,#e7d6b4_100%)]"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:py-14">
        {/* Panel */}
        <div className="order-2 lg:order-1 lg:col-span-4">
          <p className="label !tracking-[0.24em] text-gold-deep">The digital magazine</p>
          <h1 className="mt-3 font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.015em] text-ink sm:text-[2.9rem]">
            Latest Editions
          </h1>
          <p className="mt-4 max-w-[420px] text-[1rem] leading-relaxed text-ink-soft">
            The leaders, founders and builders shaping what comes next, each in a full digital
            edition you can page through.
          </p>

          <div className="mt-7 min-h-[150px] border-t border-gold/50 pt-5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.articleSlug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease }}
              >
                <p className="font-display text-[1.45rem] font-semibold leading-tight text-ink">{active.name}</p>
                {active.role ? (
                  <p className="mt-1 font-serif text-[0.95rem] italic leading-snug text-ink-soft">{active.role}</p>
                ) : null}
                {active.title ? (
                  <p className="mt-2 text-[0.98rem] leading-snug text-ink line-clamp-2">{active.title}</p>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={`/story/${active.articleSlug}`} className="btn-primary group">
              Read the feature
              <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/magazine"
              className="inline-flex items-center gap-2 border border-ink/30 px-5 py-2.5 font-sans text-[0.86rem] font-semibold text-ink no-underline transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              View all editions
            </Link>
          </div>
        </div>

        {/* Stage */}
        <div
          className="order-1 lg:order-2 lg:col-span-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
          }}
        >
          <div
            className="relative mx-auto h-[330px] touch-pan-y select-none [perspective:1600px] sm:h-[420px] lg:h-[470px]"
            onPointerDown={(e) => {
              dragX.current = e.clientX;
              dragged.current = false;
            }}
            onPointerMove={(e) => {
              if (dragX.current !== null && Math.abs(e.clientX - dragX.current) > 8) dragged.current = true;
            }}
            onPointerUp={(e) => {
              if (dragX.current === null) return;
              const dx = e.clientX - dragX.current;
              dragX.current = null;
              if (dx < -45) next();
              else if (dx > 45) prev();
            }}
            onPointerLeave={() => {
              dragX.current = null;
            }}
          >
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {issues.map((issue, index) => {
                const d = offset(index, current, count);
                const abs = Math.abs(d);
                const visible = abs <= 2;
                const isActive = d === 0;
                return (
                  <Link
                    key={issue.articleSlug}
                    href={`/story/${issue.articleSlug}`}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    aria-label={isActive ? `${issue.name}: read the feature` : undefined}
                    draggable={false}
                    onClick={(e) => {
                      if (dragged.current) {
                        e.preventDefault();
                        return;
                      }
                      if (!isActive) {
                        e.preventDefault();
                        go(index);
                      }
                    }}
                    className="absolute bottom-[6%] left-1/2 block w-[46%] max-w-[300px] no-underline sm:w-[36%] lg:w-[34%]"
                    style={{
                      transform: `translateX(-50%) translateX(${d * 62}%) translateZ(${-abs * 150}px) rotateY(${d * -32}deg) scale(${isActive ? 1 : 0.94})`,
                      zIndex: 10 - abs,
                      opacity: visible ? (abs === 2 ? 0.55 : 1) : 0,
                      pointerEvents: visible ? "auto" : "none",
                      transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, filter 0.6s ease",
                      filter: isActive ? "none" : "brightness(0.82) saturate(0.9)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={issue.cover}
                      alt={`PrimeCrest magazine cover: ${issue.name}`}
                      draggable={false}
                      loading={abs <= 1 ? "eager" : "lazy"}
                      className="block h-auto w-full rounded-[4px] shadow-[0_30px_50px_-22px_rgba(20,14,4,0.55),0_8px_18px_-10px_rgba(20,14,4,0.35)]"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          {count > 1 ? (
            <div className="mt-3 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous edition"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 bg-white/60 text-ink backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <ArrowBackIcon className="h-3.5 w-3.5" />
              </button>
              <div className="flex w-[150px] flex-col items-center gap-1.5" aria-live="polite">
                <span className="font-sans text-[0.78rem] font-semibold tabular-nums tracking-[0.14em] text-ink">
                  {String(current + 1).padStart(2, "0")}
                  <span className="text-muted"> / {String(count).padStart(2, "0")}</span>
                </span>
                <span className="relative block h-[2px] w-full overflow-hidden bg-ink/15" aria-hidden>
                  <span
                    className="absolute inset-y-0 left-0 bg-gold-deep transition-[width] duration-700 ease-out"
                    style={{ width: `${((current + 1) / count) * 100}%` }}
                  />
                </span>
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="Next edition"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 bg-white/60 text-ink backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <ArrowIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
