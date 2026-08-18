"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";

export function SearchForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const clear = () => {
    setQ("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <div
        className={`flex items-center gap-3 rounded-lg border-2 bg-paper px-4 py-3 transition-all duration-300 ${
          focused
            ? "border-ink shadow-lg shadow-ink/5"
            : "border-rule hover:border-ink-soft"
        }`}
      >
        <Search
          className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
            focused ? "text-ink" : "text-muted"
          }`}
          strokeWidth={1.8}
        />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search stories, topics, people…"
          aria-label="Search the archive"
          className="min-w-0 flex-1 bg-transparent font-serif text-[1.1rem] text-ink outline-none placeholder:text-muted/70"
        />
        {q && (
          <button
            type="button"
            onClick={clear}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={!q.trim()}
          className="flex h-9 shrink-0 items-center gap-2 rounded-md bg-ink px-4 font-sans text-[0.8rem] font-semibold text-paper transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      
      {/* Keyboard hint */}
      <p className="mt-2 text-center font-sans text-[0.72rem] text-muted">
        Press <kbd className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.68rem]">Enter</kbd> to search
      </p>
    </form>
  );
}
