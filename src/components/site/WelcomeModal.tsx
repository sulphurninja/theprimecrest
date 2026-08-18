"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/site/Logo";
import { NewsletterForm } from "@/components/site/NewsletterForm";

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
        className={`relative w-full max-w-[440px] bg-paper shadow-2xl transition-all duration-300 ${
          leaving ? "translate-y-3 opacity-0" : "animate-scale"
        }`}
      >
        {/* Accent rule on top */}
        <div className="h-1 w-full bg-accent" />

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-5 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 py-9">
          <Wordmark name="PrimeCrest" className="text-[1.5rem]" href={null} />
          <h2 className="headline mt-5 text-[1.6rem] leading-tight">
            The day&apos;s sharpest reading, in one email.
          </h2>
          <p className="mt-3 font-serif text-[0.95rem] leading-relaxed text-ink-soft">
            A considered briefing from our editors, weekday mornings. No aggregation, no filler —
            unsubscribe anytime.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <button
            type="button"
            onClick={close}
            className="mt-5 font-sans text-[0.78rem] text-muted transition-colors hover:text-ink"
          >
            Maybe later — take me to the stories
          </button>
        </div>
      </div>
    </div>
  );
}
