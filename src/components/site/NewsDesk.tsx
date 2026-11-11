"use client";

import { useState } from "react";
import { ExternalIcon } from "@/components/site/Icons";
import { NewsImage } from "@/components/site/NewsImage";
import type { NewsItem, NewsTopic } from "@/lib/news";
import { timeAgo } from "@/lib/utils";

const outbound = { target: "_blank", rel: "noopener noreferrer nofollow" } as const;

function Meta({ item }: { item: NewsItem }) {
  return (
    <p className="flex items-center gap-2 font-sans text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted">
      {item.publishedAt ? <span className="tabular text-accent">{timeAgo(item.publishedAt)}</span> : null}
      {item.source ? <span className="truncate">{item.source}</span> : null}
    </p>
  );
}

/** Art for a headline, with a typographic plate behind it in case the image fails. */
function Art({ item, className }: { item: NewsItem; className: string }) {
  return (
    <span className={`relative block overflow-hidden bg-night-3 ${className}`}>
      <span className="absolute inset-0 flex items-end p-4 font-sans text-[1.6rem] font-bold leading-none tracking-[-0.04em] text-white/10">
        {item.source || "News"}
      </span>
      <NewsImage
        src={item.image}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </span>
  );
}

/**
 * Homepage news desk: live headlines from the news API, with topic tabs that
 * load in place. Headlines link out to the original publisher.
 */
export function NewsDesk({
  topics,
  initial,
  credit,
}: {
  topics: readonly { slug: NewsTopic; label: string }[];
  initial: NewsItem[];
  credit: { name: string; url: string };
}) {
  const [topic, setTopic] = useState<NewsTopic>("business");
  const [cache, setCache] = useState<Partial<Record<NewsTopic, NewsItem[]>>>({ business: initial });
  const [loading, setLoading] = useState(false);

  async function select(next: NewsTopic) {
    setTopic(next);
    if (cache[next]) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/public/news?topic=${next}`);
      const data = res.ok ? ((await res.json()) as { items: NewsItem[] }) : { items: [] };
      setCache((prev) => ({ ...prev, [next]: data.items }));
    } catch {
      setCache((prev) => ({ ...prev, [next]: [] }));
    } finally {
      setLoading(false);
    }
  }

  const items = cache[topic] || [];
  const [lead, ...rest] = items;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="wire-pulse" aria-hidden /> Live
          </p>
          <h2 className="statement mt-3 text-[2.2rem] text-ink sm:text-[2.8rem]">Around the world</h2>
          <p className="mt-2 max-w-md text-[0.98rem] text-ink-soft">
            What the world&apos;s newsrooms are reporting right now, refreshed through the day.
          </p>
        </div>
        <div className="scrollbar-none -mx-1 flex max-w-full gap-6 overflow-x-auto border-b border-ink/10 px-1" role="tablist">
          {topics.map((t) => (
            <button
              key={t.slug}
              type="button"
              role="tab"
              aria-selected={t.slug === topic}
              onClick={() => select(t.slug)}
              className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-[0.86rem] font-semibold transition-colors ${
                t.slug === topic
                  ? "border-accent text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-10 transition-opacity duration-300 ${loading ? "opacity-40" : ""}`} role="tabpanel">
        {!lead ? (
          <p className="rounded-md bg-paper-2 px-6 py-16 text-center text-ink-soft">
            {loading ? "Loading headlines…" : "No headlines came through for this topic just now."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <a href={lead.url} {...outbound} className="group block no-underline lg:col-span-6">
              <Art item={lead} className="aspect-[16/10] rounded-md" />
              <div className="mt-4">
                <Meta item={lead} />
                <h3 className="statement mt-2 text-[1.7rem] text-ink transition-colors group-hover:text-accent sm:text-[2rem]">
                  {lead.title}
                </h3>
                {lead.description ? (
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft line-clamp-2">
                    {lead.description}
                  </p>
                ) : null}
              </div>
            </a>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
              {rest.slice(0, 2).map((item) => (
                <a key={item.id} href={item.url} {...outbound} className="group block no-underline">
                  <Art item={item} className="aspect-[16/10] rounded-md" />
                  <div className="mt-3">
                    <Meta item={item} />
                    <h3 className="headline mt-1.5 text-[1.05rem] leading-snug text-ink transition-colors group-hover:text-accent">
                      {item.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>

            <ul className="border-t border-ink/10 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-6">
              {rest.slice(2, 8).map((item) => (
                <li key={item.id} className="border-b border-ink/10 py-3.5 first:pt-4 last:border-b-0 lg:first:pt-0">
                  <a href={item.url} {...outbound} className="group block no-underline">
                    <Meta item={item} />
                    <span className="mt-1 flex items-start justify-between gap-3">
                      <span className="headline text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-accent">
                        {item.title}
                      </span>
                      <ExternalIcon className="mt-1 h-3 w-3 shrink-0 text-muted" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-8 font-sans text-[0.72rem] text-muted">
        Headlines link to the original publisher. Collected via{" "}
        <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
          {credit.name}
        </a>
        .
      </p>
    </div>
  );
}
