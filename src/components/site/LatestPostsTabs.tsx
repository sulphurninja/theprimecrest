"use client";

import Link from "next/link";
import { useState } from "react";

type TabArticle = {
  _id: string;
  title: string;
  slug: string;
  category?: { name: string; slug: string };
  excerpt?: string;
};

const TABS = ["Latest", "Trending", "Popular"] as const;

export function LatestPostsTabs({
  latest,
  trending,
}: {
  latest: TabArticle[];
  trending: TabArticle[];
}) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Latest");

  const articles =
    active === "Latest" ? latest : active === "Trending" ? trending : latest;

  return (
    <div>
      <div className="flex border-b border-rule">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap border-b-2 px-2.5 py-2.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors ${
              active === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <ul className="mt-2">
        {articles.slice(0, 5).map((article) => (
          <li key={article._id} className="border-b border-rule/50 py-3.5 last:border-b-0">
            <h4 className="font-sans text-[0.82rem] font-semibold leading-snug text-ink">
              <Link
                href={`/story/${article.slug}`}
                className="no-underline transition-colors hover:text-accent"
              >
                {article.title}
              </Link>
            </h4>
            {article.excerpt ? (
              <p className="mt-1.5 line-clamp-1 font-serif text-[0.75rem] leading-relaxed text-muted">
                {article.excerpt}
              </p>
            ) : null}
          </li>
        ))}
        {articles.length === 0 ? (
          <li className="py-6 text-center font-serif text-[0.85rem] text-muted">
            No articles yet.
          </li>
        ) : null}
      </ul>
      <Link
        href="/search"
        className="mt-4 inline-block font-sans text-[0.75rem] font-semibold text-accent no-underline hover:text-accent-hover"
      >
        More Latest Articles →
      </Link>
    </div>
  );
}
