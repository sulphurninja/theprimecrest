"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
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

export const MAG_PAGE_W = 840;
export const MAG_PAGE_H = 1120;

export type MagTocItem = { page: number; label: string };

type Layout = {
  fit: number;
  frameW: number;
  frameH: number;
  shiftX: number;
  bookW: number;
  portrait: boolean;
};

type Props = {
  children: React.ReactNode;
  title: string;
  toc: MagTocItem[];
};

function waitImages(root: ParentNode) {
  const imgs = Array.from(root.querySelectorAll("img"));
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

export function HtmlFlipbook({ children, title, toc = [] }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const flippingRef = useRef(false);
  const zoomRef = useRef(1);
  const pageCountRef = useRef(0);
  const textsRef = useRef<string[]>([]);

  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [pageCount, setPageCount] = useState(0);
  const [layout, setLayout] = useState<Layout>({
    fit: 1,
    frameW: MAG_PAGE_W * 2,
    frameH: MAG_PAGE_H,
    shiftX: 0,
    bookW: MAG_PAGE_W * 2,
    portrait: false,
  });
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const closePanels = () => {
    setTocOpen(false);
    setSearchOpen(false);
    setShareOpen(false);
  };

  const computeLayout = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const availW = Math.max(240, vp.clientWidth - 8);
    const availH = Math.max(280, vp.clientHeight - 8);
    const portrait = window.innerWidth < 860;
    const idx = indexRef.current;
    const flipping = flippingRef.current;
    const coverLike = !portrait && !flipping && (idx === 0 || idx >= pageCountRef.current - 1);
    const visW = portrait || coverLike ? MAG_PAGE_W : MAG_PAGE_W * 2;
    const fit = Math.min(availW / visW, availH / MAG_PAGE_H);
    const scale = fit * zoomRef.current;
    const shiftX = !portrait && !flipping && idx === 0 ? -MAG_PAGE_W : 0;
    setLayout({
      fit: scale,
      frameW: visW * scale,
      frameH: MAG_PAGE_H * scale,
      shiftX,
      bookW: portrait ? MAG_PAGE_W : MAG_PAGE_W * 2,
      portrait,
    });
  }, []);

  const mount = useCallback(async () => {
    const outer = outerRef.current;
    const book = bookRef.current;
    if (!outer || !book) return;

    const sources = book.querySelectorAll<HTMLElement>(".mag-page");
    if (!sources.length) return;

    pageCountRef.current = sources.length;
    setPageCount(sources.length);
    textsRef.current = Array.from(sources).map((el) => (el.innerText || "").replace(/\s+/g, " ").trim());

    await waitImages(book);

    try {
      flipRef.current?.destroy();
    } catch {
      /* empty */
    }
    flipRef.current = null;
    outer.innerHTML = "";

    const host = document.createElement("div");
    const portrait = window.innerWidth < 860;
    const bookW = portrait ? MAG_PAGE_W : MAG_PAGE_W * 2;
    host.style.width = `${bookW}px`;
    host.style.height = `${MAG_PAGE_H}px`;
    outer.appendChild(host);

    const pf = new PageFlip(host, {
      width: MAG_PAGE_W,
      height: MAG_PAGE_H,
      size: "fixed",
      minWidth: MAG_PAGE_W,
      maxWidth: MAG_PAGE_W,
      minHeight: MAG_PAGE_H,
      maxHeight: MAG_PAGE_H,
      drawShadow: true,
      flippingTime: 900,
      usePortrait: portrait,
      startZIndex: 2,
      autoSize: false,
      maxShadowOpacity: 0.45,
      showCover: true,
      mobileScrollSupport: false,
      swipeDistance: 28,
      showPageCorners: true,
      disableFlipByClick: false,
      useMouseEvents: false,
      clickEventForward: true,
    });

    const clones = Array.from(sources).map((el) => el.cloneNode(true) as HTMLElement);

    pf.on("flip", (e) => {
      const page = Number(e.data) || 0;
      indexRef.current = page;
      setIndex(page);
      setPageInput(String(page + 1));
      flippingRef.current = false;
      computeLayout();
    });
    pf.on("changeState", (e) => {
      const s = String(e.data);
      flippingRef.current = s === "flipping" || s === "user_fold";
      computeLayout();
    });
    pf.on("init", () => {
      const page = pf.getCurrentPageIndex();
      indexRef.current = page;
      setIndex(page);
      setPageInput(String(page + 1));
      requestAnimationFrame(() => computeLayout());
    });

    pf.loadFromHTML(clones);
    await waitImages(host);
    flipRef.current = pf;
    setReady(true);
    requestAnimationFrame(() => computeLayout());
  }, [computeLayout]);

  useEffect(() => {
    let cancelled = false;
    const t = requestAnimationFrame(() => {
      if (!cancelled) void mount();
    });

    let lastPortrait = window.innerWidth < 860;
    const onResize = () => {
      const portrait = window.innerWidth < 860;
      if (portrait !== lastPortrait) {
        lastPortrait = portrait;
        setReady(false);
        void mount();
        return;
      }
      computeLayout();
    };

    window.addEventListener("resize", onResize);
    const ro = viewportRef.current ? new ResizeObserver(() => computeLayout()) : null;
    if (viewportRef.current && ro) ro.observe(viewportRef.current);
    void document.fonts?.ready.then(() => {
      if (!cancelled) computeLayout();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(t);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      try {
        flipRef.current?.destroy();
      } catch {
        /* empty */
      }
      flipRef.current = null;
    };
  }, [mount, computeLayout]);

  useEffect(() => {
    computeLayout();
  }, [zoom, computeLayout]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") flipRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
      if (e.key === "Escape") closePanels();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const spreads = useMemo(() => {
    if (pageCount <= 0) return [] as number[][];
    const out: number[][] = [[0]];
    for (let i = 1; i < pageCount; i += 2) {
      out.push(i + 1 < pageCount ? [i, i + 1] : [i]);
    }
    return out;
  }, [pageCount]);

  useEffect(() => {
    const start = spreads.find((s) => s.includes(index))?.[0];
    if (start == null) return;
    const thumb = stripRef.current?.querySelector(`[data-page="${start}"]`);
    thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index, spreads]);

  useLayoutEffect(() => {
    const book = bookRef.current;
    const strip = stripRef.current;
    if (!book || !strip || !pageCount) return;
    const sources = book.querySelectorAll<HTMLElement>(".mag-page");
    strip.querySelectorAll<HTMLElement>("[data-thumb-host]").forEach((host) => {
      if (host.childElementCount > 0) return;
      const pageIndex = Number(host.dataset.thumbSrc);
      const page = sources[pageIndex];
      if (!page) return;
      const clone = page.cloneNode(true) as HTMLElement;
      clone.removeAttribute("data-density");
      host.appendChild(clone);
    });
  });

  function toBookPoint(clientX: number, clientY: number) {
    const frame = frameRef.current;
    const L = layoutRef.current;
    if (!frame || L.fit <= 0) return null;
    const r = frame.getBoundingClientRect();
    return {
      x: (clientX - r.left) / L.fit - L.shiftX,
      y: (clientY - r.top) / L.fit,
    };
  }

  function onBookPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const pos = toBookPoint(e.clientX, e.clientY);
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    flipRef.current?.startUserTouch(pos);
  }

  function onBookPointerMove(e: PointerEvent<HTMLDivElement>) {
    const pos = toBookPoint(e.clientX, e.clientY);
    if (!pos) return;
    flipRef.current?.userMove(pos, e.pointerType !== "mouse");
  }

  function onBookPointerUp(e: PointerEvent<HTMLDivElement>) {
    const pos = toBookPoint(e.clientX, e.clientY);
    if (!pos) return;
    flipRef.current?.userStop(pos);
  }

  function go(page: number) {
    const pf = flipRef.current;
    if (!pf) return;
    pf.flip(Math.max(0, Math.min(pageCount - 1, page)));
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

  const spreadLabel = layout.portrait
    ? `${index + 1} / ${pageCount}`
    : index === 0
      ? `1 / ${pageCount}`
      : index >= pageCount - 1
        ? `${pageCount} / ${pageCount}`
        : `${index + 1}–${Math.min(index + 2, pageCount)} / ${pageCount}`;

  const q = query.trim().toLowerCase();
  const matches = q
    ? textsRef.current
        .map((text, i) => ({ i, text }))
        .filter(
          (p) =>
            p.text.toLowerCase().includes(q) ||
            toc.some((t) => t.page === p.i && t.label.toLowerCase().includes(q)),
        )
    : [];

  return (
    <div ref={stageRef} className="relative flex h-dvh select-none flex-col overflow-hidden bg-stage">
      {!ready ? (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-stage">
          <p className="kicker">Opening the issue</p>
          <h1 className="headline mt-3 text-[1.6rem] text-paper">{title}</h1>
          <div className="loader-bar mt-8 w-40">
            <span />
          </div>
        </div>
      ) : null}

      <header className="relative z-30 flex shrink-0 justify-center px-3 py-2.5">
        <div className="glass flex max-w-[min(100%,980px)] items-center gap-0.5 rounded-full px-2 py-1.5">
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
            onClick={() => {
              const next = Math.max(1, +(zoom - 0.12).toFixed(2));
              zoomRef.current = next;
              setZoom(next);
            }}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min={1}
            max={2.2}
            step={0.05}
            value={zoom}
            onChange={(e) => {
              const next = Number(e.target.value);
              zoomRef.current = next;
              setZoom(next);
            }}
            aria-label="Zoom"
            className="hidden w-24 accent-[var(--accent)] sm:block"
          />
          <button
            type="button"
            className="tool-btn"
            aria-label="Zoom in"
            onClick={() => {
              const next = Math.min(2.2, +(zoom + 0.12).toFixed(2));
              zoomRef.current = next;
              setZoom(next);
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
          <span className="hidden w-8 text-center font-sans text-[0.68rem] tabular-nums text-fog-dim sm:block">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            className="tool-btn"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={() => void toggleFullscreen()}
          >
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

          <button type="button" className="tool-btn" aria-label="Previous page" onClick={() => flipRef.current?.flipPrev()}>
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
              className="h-8 w-10 rounded-md border border-line bg-stage-2 px-1 text-center font-sans text-[0.75rem] tabular-nums text-paper"
            />
            <span className="ml-1 hidden font-sans text-[0.72rem] text-fog-dim sm:inline">/ {pageCount}</span>
          </form>
          <button type="button" className="tool-btn" aria-label="Next page" onClick={() => flipRef.current?.flipNext()}>
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

      {tocOpen ? (
        <aside className="glass absolute left-3 top-full z-40 mt-1 flex max-h-[70vh] w-[min(280px,calc(100%-1.5rem))] flex-col rounded-lg animate-in">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-fog">Contents</p>
            <button type="button" className="tool-btn h-8 w-8" onClick={() => setTocOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <nav className="overflow-y-auto py-2">
            {toc.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => {
                  go(item.page);
                  setTocOpen(false);
                }}
                className={`flex w-full items-baseline justify-between px-4 py-2 text-left font-sans text-[0.85rem] transition-colors ${
                  index === item.page || (index === item.page - 1 && index > 0)
                    ? "bg-paper/8 text-paper"
                    : "text-fog hover:bg-paper/5 hover:text-paper"
                }`}
              >
                <span>{item.label}</span>
                <span className="tabular-nums text-fog-dim">{String(item.page + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
        </aside>
      ) : null}

      {searchOpen ? (
        <div className="glass absolute right-3 top-full z-40 mt-1 w-[min(320px,calc(100%-1.5rem))] rounded-lg p-4 animate-in">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this issue…"
            className="field"
          />
          <div className="mt-3 max-h-56 overflow-y-auto">
            {q && !matches.length ? (
              <p className="py-4 text-center font-sans text-[0.8rem] text-fog-dim">Nothing in this issue.</p>
            ) : (
              matches.map((p) => (
                <button
                  key={p.i}
                  type="button"
                  onClick={() => {
                    go(p.i);
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left hover:bg-paper/6"
                >
                  <span className="font-sans text-[0.72rem] tabular-nums text-fog-dim">{p.i + 1}</span>
                  <span className="line-clamp-2 font-sans text-[0.82rem] text-paper">{p.text.slice(0, 90)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      {shareOpen ? (
        <div className="glass absolute right-3 top-full z-40 mt-1 w-56 rounded-lg p-3 animate-in">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-[0.85rem] text-paper hover:bg-paper/6"
          >
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}
      </header>

      <div
        ref={viewportRef}
        className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-2 ${
          ready ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => flipRef.current?.flipPrev()}
          className="absolute left-2 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-paper/12 text-paper/90 backdrop-blur-sm transition hover:bg-paper/22 md:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => flipRef.current?.flipNext()}
          className="absolute right-2 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-paper/12 text-paper/90 backdrop-blur-sm transition hover:bg-paper/22 md:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div
          ref={frameRef}
          className="relative touch-none overflow-hidden"
          style={{
            width: layout.frameW,
            height: layout.frameH,
            boxShadow: "0 28px 80px rgba(0,0,0,0.55)",
          }}
          onPointerDown={onBookPointerDown}
          onPointerMove={onBookPointerMove}
          onPointerUp={onBookPointerUp}
          onPointerCancel={onBookPointerUp}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: layout.bookW,
              height: MAG_PAGE_H,
              transform: `scale(${layout.fit}) translateX(${layout.shiftX}px)`,
              transformOrigin: "top left",
            }}
          >
            <div ref={outerRef} />
          </div>
        </div>
      </div>

      <footer className="relative z-20 shrink-0 pb-2">
        <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-3">
          <button
            type="button"
            aria-label="Scroll thumbnails left"
            onClick={() => stripRef.current?.scrollBy({ left: -240, behavior: "smooth" })}
            className="tool-btn hidden shrink-0 sm:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            ref={stripRef}
            className="scrollbar-none flex flex-1 items-center gap-2 overflow-x-auto px-2 py-8"
          >
            {spreads.map((pages) => (
              <button
                key={pages[0]}
                type="button"
                data-page={pages[0]}
                onClick={() => go(pages[0])}
                aria-label={
                  pages.length === 2
                    ? `Pages ${pages[0] + 1}–${pages[1] + 1}`
                    : `Page ${pages[0] + 1}`
                }
                className={`mag-thumb ${pages.length === 2 ? "is-spread" : ""} ${
                  pages.includes(index) ? "is-current" : ""
                }`}
              >
                {pages.map((page) => (
                  <div
                    key={page}
                    data-thumb-host
                    data-thumb-src={page}
                    className="mag-thumb-host"
                  />
                ))}
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
        <p className="text-center font-sans text-[0.68rem] tabular-nums text-fog-dim">{spreadLabel}</p>
      </footer>

      <div ref={bookRef} className="pointer-events-none invisible absolute h-0 w-0 overflow-hidden" aria-hidden>
        {children}
      </div>
    </div>
  );
}
