"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Search, Mail, TrendingUp } from "lucide-react";

type Item = { label: string; href: string };

export function MobileNav({
  items,
  siteName,
  tagline,
  dark = false,
}: {
  items: Item[];
  siteName: string;
  tagline: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    }
    document.body.style.overflow = "";
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`relative z-50 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 active:scale-95 ${
          dark
            ? "text-paper hover:bg-paper/10"
            : "text-ink hover:bg-paper-2"
        }`}
      >
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        <span
          className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${
            open ? "rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${
            open ? "opacity-0 scale-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute h-[1.5px] w-5 bg-current transition-all duration-300 ${
            open ? "-rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-[320px] bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-rule px-6">
            <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
              Navigation
            </span>
          </div>

          {/* Sections */}
          <nav className="flex-1 px-6 py-6" aria-label="Sections">
            <p className="mb-4 font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
              Sections
            </p>
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li
                  key={item.href}
                  style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateX(0)" : "translateX(20px)",
                    transition: `all 0.4s cubic-bezier(0.32, 0.72, 0, 1) ${
                      open ? 80 + i * 50 : 0
                    }ms`,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    className="group flex items-center justify-between py-3 no-underline transition-colors"
                  >
                    <span className="headline text-[1.35rem] text-ink transition-colors group-hover:text-accent">
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <div className="border-t border-rule px-6 py-6">
            <p className="mb-4 font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">
              Quick Links
            </p>
            <div className="space-y-2">
              <Link
                href="/search"
                onClick={close}
                className="flex items-center gap-3 rounded-lg bg-paper-2 px-4 py-3 font-sans text-[0.85rem] font-medium text-ink no-underline transition-all hover:bg-ink hover:text-paper"
              >
                <Search className="h-4 w-4" />
                Search Archive
              </Link>
              <Link
                href="/newsletter"
                onClick={close}
                className="flex items-center gap-3 rounded-lg bg-ink px-4 py-3 font-sans text-[0.85rem] font-medium text-paper no-underline transition-all hover:bg-accent"
              >
                <Mail className="h-4 w-4" />
                Subscribe to {siteName}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-rule px-6 py-5">
            <Link
              href="/advertise"
              onClick={close}
              className="flex items-center gap-2 font-sans text-[0.8rem] font-medium text-accent no-underline transition-colors hover:text-accent-hover"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Advertise with us
            </Link>
            <p className="mt-4 font-serif text-[0.85rem] italic leading-relaxed text-muted">
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
