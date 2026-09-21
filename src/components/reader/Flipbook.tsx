"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PageFlip } from "page-flip";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  Share2,
  Maximize,
  Minimize,
  Minus,
  Plus,
  X,
  Link2,
  Check,
} from "lucide-react";
import { CoverLoader } from "@/components/reader/CoverLoader";
import { thumbUrl } from "@/lib/utils";
import type { PublicMagazine } from "@/lib/queries";

type Props = { magazine: PublicMagazine };

export function Flipbook({ magazine }: Props) {
  const pages = magazine.pages ?? [];
  const urlKey = pages.map((p) => p.url).join("\n");

  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const urls = urlKey ? urlKey.split("\n") : [];
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(urls.length);
  const [portrait, setPortrait] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [pageInput, setPageInput] = useState("1");

  // Preload every page so the first flip is never a blank canvas.
  useEffect(() => {
    const urls = urlKey ? urlKey.split("\n") : [];
    if (!urls.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
      return;
    }
    let loaded = 0;
    const done = () => {
      loaded += 1;
      setProgress(loaded / urls.length);
      if (loaded >= urls.length) setReady(true);
    };
    urls.forEach((src) => {
      const img = new window.Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  }, [urlKey]);

  const mountBook = useCallback(() => {
    const host = hostRef.current;
    const urls = urlKey ? urlKey.split("\n") : [];
    if (!host || !urls.length) return;

    host.innerHTML = "";
    const inner = document.createElement("div");
    host.appendChild(inner);

    const width = Math.min(520, Math.max(280, Math.floor(window.innerWidth * 0.38)));
    const height = Math.round(width * 1.333);

    const pf = new PageFlip(inner, {
      width,
      height,
      size: "stretch",
      minWidth: 280,
      maxWidth: 620,
      minHeight: 380,
      maxHeight: 860,
      drawShadow: true,
      flippingTime: 900,
      usePortrait: false,
      startZIndex: 1,
      autoSize: true,
      maxShadowOpacity: 0.55,
      showCover: false,
      mobileScrollSupport: false,
      swipeDistance: 28,
      showPageCorners: true,
      disableFlipByClick: false,
      useMouseEvents: true,
    });

    pf.loadFromImages(urls);
    pf.on("flip", (e) => {
      const page = Number(e.data) || 0;
      setIndex(page);
      setPageInput(String(page + 1));
    });
    pf.on("init", () => {
      setCount(pf.getPageCount());
      setPortrait(pf.getOrientation() === "portrait");
      setIndex(pf.getCurrentPageIndex());
    });
    pf.on("changeOrientation", (e) => {
      setPortrait(e.data === "portrait");
      try {
        pf.update();
      } catch {
        /* empty */
      }
    });

    flipRef.current = pf;
    setCount(urls.length);
  }, [urlKey]);

  useEffect(() => {
    if (!ready) return;
    mountBook();
    const onResize = () => {
      try {
        flipRef.current?.update();
      } catch {
        /* empty */
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      try {
        flipRef.current?.destroy();
      } catch {
        /* empty */
      }
      flipRef.current = null;
    };
  }, [ready, mountBook]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
      if (e.key === "Escape") {
        setTocOpen(false);
        setSearchOpen(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const thumb = stripRef.current?.querySelector(`[data-page="${index}"]`);
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  function go(page: number) {
    const pf = flipRef.current;
    if (!pf) return;
    const next = Math.max(0, Math.min(count - 1, page));
    pf.flip(next);
  }

  async function toggleFullscreen() {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setFullscreen(false);
    } else {
      await el.requestFullscreen();
      setFullscreen(true);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* empty */
    }
  }

  const pageLabel = portrait
    ? `${index + 1} / ${count}`
    : index === 0
      ? `1 / ${count}`
      : `${index + 1}–${Math.min(index + 2, count)} / ${count}`;

  const matches = query.trim()
    ? pages
        .map((p, i) => ({ ...p, i }))
        .filter(
          (p) =>
            (p.caption || "").toLowerCase().includes(query.toLowerCase()) ||
            `page ${p.i + 1}`.includes(query.toLowerCase()),
        )
    : [];

  if (!urls.length) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="font-serif text-fog-dim">This issue has no pages yet.</p>
      </div>
    );
  }

  return (
    <div ref={stageRef} className="relative flex h-dvh flex-col overflow-hidden bg-stage">
      {!ready ? (
        <CoverLoader
          cover={magazine.coverImage || urls[0]}
          title={magazine.title}
          issue={magazine.issueLabel}
          progress={progress}
        />
      ) : null}

      {/* Toolbar */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-3 pt-3 transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-auto glass flex max-w-[min(100%,920px)] items-center gap-1 rounded-full px-2 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            className="tool-btn"
            aria-label="Table of contents"
            data-active={tocOpen}
            onClick={() => {
              setTocOpen((v) => !v);
              setSearchOpen(false);
              setShareOpen(false);
            }}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="tool-btn"
            aria-label="Share"
            data-active={shareOpen}
            onClick={() => {
              setShareOpen((v) => !v);
              setTocOpen(false);
              setSearchOpen(false);
            }}
          >
            <Share2 className="h-4 w-4" />
          </button>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <button
            type="button"
            className="tool-btn"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.15).toFixed(2)))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min={1}
            max={2.2}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="hidden w-24 accent-[var(--accent)] sm:block"
          />
          <button
            type="button"
            className="tool-btn"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="hidden w-8 font-sans text-[0.68rem] tabular-nums text-fog-dim sm:block">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            className="tool-btn"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <button
            type="button"
            className="tool-btn"
            aria-label="Previous page"
            onClick={() => flipRef.current?.flipPrev()}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(pageInput, 10);
              if (!Number.isNaN(n)) go(n - 1);
            }}
            className="flex items-center"
          >
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/[^\d]/g, ""))}
              aria-label="Go to page"
              className="h-8 w-[4.6rem] rounded-md border border-line bg-stage-2 px-2 text-center font-sans text-[0.75rem] tabular-nums text-paper"
            />
            <span className="ml-1 hidden font-sans text-[0.72rem] text-fog-dim sm:inline">
              / {count}
            </span>
          </form>
          <button
            type="button"
            className="tool-btn"
            aria-label="Next page"
            onClick={() => flipRef.current?.flipNext()}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <button
            type="button"
            className="tool-btn"
            aria-label="Search this issue"
            data-active={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              setTocOpen(false);
              setShareOpen(false);
            }}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* TOC */}
      {tocOpen ? (
        <aside className="glass absolute left-3 top-16 z-40 flex max-h-[70vh] w-[min(280px,calc(100%-1.5rem))] flex-col rounded-lg animate-in">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-fog">
              Contents
            </p>
            <button type="button" className="tool-btn h-8 w-8" onClick={() => setTocOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <nav className="overflow-y-auto py-2">
            {pages.map((p, i) => (
              <button
                key={p._id}
                type="button"
                onClick={() => {
                  go(i);
                  setTocOpen(false);
                }}
                className={`flex w-full items-baseline justify-between px-4 py-2 text-left font-sans text-[0.85rem] transition-colors ${
                  i === index ? "bg-paper/8 text-paper" : "text-fog hover:bg-paper/5 hover:text-paper"
                }`}
              >
                <span className="truncate pr-3">{p.caption || (i === 0 ? "Cover" : `Page ${i + 1}`)}</span>
                <span className="tabular-nums text-fog-dim">{i + 1}</span>
              </button>
            ))}
          </nav>
        </aside>
      ) : null}

      {/* Search */}
      {searchOpen ? (
        <div className="glass absolute right-3 top-16 z-40 w-[min(320px,calc(100%-1.5rem))] rounded-lg p-4 animate-in">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this issue…"
            className="field"
          />
          <div className="mt-3 max-h-56 overflow-y-auto">
            {query.trim() && !matches.length ? (
              <p className="py-4 text-center font-sans text-[0.8rem] text-fog-dim">Nothing in this issue.</p>
            ) : (
              matches.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => {
                    go(p.i);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-paper/6"
                >
                  <span className="font-sans text-[0.72rem] tabular-nums text-fog-dim">{p.i + 1}</span>
                  <span className="truncate font-sans text-[0.85rem] text-paper">
                    {p.caption || `Page ${p.i + 1}`}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      {/* Share */}
      {shareOpen ? (
        <div className="glass absolute right-3 top-16 z-40 w-56 rounded-lg p-3 animate-in">
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-[0.85rem] text-paper hover:bg-paper/6"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(magazine.title)}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-[0.85rem] text-paper no-underline hover:bg-paper/6"
          >
            Share on X
          </a>
        </div>
      ) : null}

      {/* Stage */}
      <div
        className={`relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-28 pt-16 transition-opacity duration-500 ${
          ready ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => flipRef.current?.flipPrev()}
          className="absolute left-2 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper/80 backdrop-blur-sm transition hover:bg-paper/20 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => flipRef.current?.flipNext()}
          className="absolute right-2 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-paper/80 backdrop-blur-sm transition hover:bg-paper/20 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          className="flipbook-stage origin-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <div ref={hostRef} className="mx-auto" />
        </div>
      </div>

      {/* Thumbnail strip */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 pb-3 pt-2 transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-3">
          <button
            type="button"
            aria-label="Scroll thumbnails left"
            onClick={() => stripRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
            className="tool-btn hidden shrink-0 sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div ref={stripRef} className="scrollbar-none flex flex-1 gap-2 overflow-x-auto py-1">
            {pages.map((p, i) => (
              <button
                key={p._id}
                type="button"
                data-page={i}
                onClick={() => go(i)}
                aria-label={p.caption || `Page ${i + 1}`}
                className={`relative h-[72px] w-[54px] shrink-0 overflow-hidden rounded-[2px] border-2 transition ${
                  i === index
                    ? "border-paper shadow-[0_0_0_1px_rgba(201,162,75,0.6)]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumbUrl(p.url, 120)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="54px"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll thumbnails right"
            onClick={() => stripRef.current?.scrollBy({ left: 240, behavior: "smooth" })}
            className="tool-btn hidden shrink-0 sm:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-center font-sans text-[0.68rem] tabular-nums text-fog-dim">
          {pageLabel}
        </p>
      </div>
    </div>
  );
}
