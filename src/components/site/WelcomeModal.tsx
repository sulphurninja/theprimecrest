"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/site/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { LATEST_ISSUE, issueLabel } from "@/lib/magazines";

const SHOW_AFTER_MS = 7000;

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("welcome-shown")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("welcome-shown", "1");
    }, SHOW_AFTER_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setLeaving(true);
    setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 250);
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center transition-opacity duration-250 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter invitation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={`relative grid w-full max-w-[760px] grid-cols-1 overflow-hidden bg-surface shadow-2xl transition-all duration-300 sm:grid-cols-[250px_1fr] ${
          leaving ? "translate-y-3 opacity-0" : "animate-scale"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {/* This month's cover */}
        <div className="hidden flex-col items-center justify-center gap-4 bg-ink px-8 py-10 sm:flex">
          <p className="label !tracking-[0.24em] text-gold-soft">{issueLabel(LATEST_ISSUE)}</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LATEST_ISSUE.cover}
            alt={`PrimeCrest ${issueLabel(LATEST_ISSUE)}: ${LATEST_ISSUE.name}`}
            className="w-full max-w-[170px] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.8)]"
          />
          <p className="text-center font-display text-[1rem] font-semibold text-white">{LATEST_ISSUE.name}</p>
        </div>

        <div className="px-7 py-9 sm:px-9">
          <Wordmark name="PrimeCrest" className="text-[1.4rem]" href={null} />
          <p className="label mt-6 !tracking-[0.24em] text-accent">The PrimeCrest Briefing</p>
          <h2 className="display-caps mt-3 text-[1.9rem] leading-[1.02]">
            Business intelligence, every morning
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
            Each weekday morning, the leaders, companies and ideas moving global business, edited
            into one concise email. Free, and you can unsubscribe at any time.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <button
            type="button"
            onClick={close}
            className="read-more mt-6 text-muted hover:text-ink"
          >
            Not now, continue reading
          </button>
        </div>
      </div>
    </div>
  );
}
