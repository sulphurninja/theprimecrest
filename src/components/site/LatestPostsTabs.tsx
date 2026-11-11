"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowIcon } from "@/components/site/Icons";

type TabArticle = {
  _id: string;
  title: string;
  slug: string;
  category?: { name: string; slug: string };
  excerpt?: string;
};

const TABS = ["Latest", "Most read"] as const;

export function LatestPostsTabs({
  latest,
  trending,
}: {
  latest: TabArticle[];
  trending: TabArticle[];
}) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Latest");

  const articles = active === "Latest" ? latest : trending;

  return (
    <div>
      <div className="flex gap-1 rounded-full bg-paper-2 p-1" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`flex-1 whitespace-nowrap rounded-full px-3 py-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.12em] transition-all ${
              active === tab ? "bg-ink text-paper shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <ol className="mt-3" role="tabpanel">
        {articles.slice(0, 5).map((article, i) => (
          <li key={article._id} className="group flex gap-4 border-b border-rule py-4 last:border-b-0">
            <span className="statement w-6 shrink-0 text-[1.7rem] leading-none text-accent">
              {i + 1}
            </span>
            <div className="min-w-0">
              {article.category?.name ? (
                <p className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted">
                  {article.category.name}
                </p>
              ) : null}
              <h4 className="headline mt-1 text-[1rem] leading-snug text-ink">
                <Link href={`/story/${article.slug}`}>{article.title}</Link>
              </h4>
            </div>
          </li>
        ))}
        {articles.length === 0 ? (
          <li className="py-6 text-center font-serif text-[0.85rem] text-muted">No articles yet.</li>
        ) : null}
      </ol>
      <Link
        href="/search"
        className="group mt-3 inline-flex items-center gap-1.5 font-sans text-[0.75rem] font-semibold text-ink no-underline"
      >
        <span className="nav-link">The full archive</span>
        <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
