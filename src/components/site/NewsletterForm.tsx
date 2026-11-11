"use client";

import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { ArrowIcon } from "@/components/site/Icons";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [focused, setFocused] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) setEmail("");
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
          dark ? "bg-paper/10" : "bg-paper-2"
        } animate-scale`}
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            dark ? "bg-paper text-ink" : "bg-ink text-paper"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <p
          className={`font-serif text-[0.95rem] ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          You&apos;re on the list. The next letter arrives soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <div
        className={`flex items-stretch gap-1 rounded-full border p-1 transition-all duration-200 ${
          dark
            ? focused
              ? "border-paper/50 bg-paper/10"
              : "border-paper/25 bg-paper/5 hover:border-paper/40"
            : focused
              ? "border-ink bg-surface shadow-[0_0_0_4px_rgba(14,14,16,0.06)]"
              : "border-rule bg-surface hover:border-paper-3"
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter your email"
          aria-label="Email address"
          className={`min-w-0 flex-1 bg-transparent px-4 py-2.5 font-sans text-[0.92rem] outline-none ${
            dark
              ? "text-paper placeholder:text-paper/50"
              : "text-ink placeholder:text-muted"
          }`}
        />
        <button
          type="submit"
          disabled={status === "busy" || !email}
          className={`group flex shrink-0 items-center gap-2 rounded-full px-5 font-sans text-[0.84rem] font-semibold transition-colors disabled:opacity-50 ${
            dark ? "bg-paper text-ink hover:bg-gold-soft" : "bg-ink text-white hover:bg-accent"
          }`}
        >
          {status === "busy" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Subscribe</span>
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      {status === "err" && (
        <div className="mt-3 flex items-center gap-2 animate-in">
          <AlertCircle className="h-4 w-4 text-accent" />
          <p className="font-sans text-[0.8rem] text-accent">
            That didn&apos;t go through. Please try again.
          </p>
        </div>
      )}
    </form>
  );
}
