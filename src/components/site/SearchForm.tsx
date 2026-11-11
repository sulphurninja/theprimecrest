"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ArrowIcon, SearchIcon } from "@/components/site/Icons";

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
        className={`flex items-center gap-3 rounded-full border bg-surface py-1.5 pl-5 pr-1.5 transition-all duration-300 ${
          focused
            ? "border-ink shadow-[0_0_0_4px_rgba(14,14,16,0.06)]"
            : "border-rule hover:border-paper-3"
        }`}
      >
        <SearchIcon
          className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
            focused ? "text-ink" : "text-muted"
          }`}
        />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search stories, topics, people…"
          aria-label="Search the archive"
          className="min-w-0 flex-1 bg-transparent py-2 font-sans text-[1.05rem] text-ink outline-none placeholder:text-muted/70"
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
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 font-sans text-[0.84rem] font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowIcon className="h-4 w-4" />
        </button>
      </div>
      
    </form>
  );
}
