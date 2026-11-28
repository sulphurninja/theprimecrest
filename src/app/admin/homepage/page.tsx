"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { AdminLoader, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type ArticleOpt = { _id: string; title: string; slug: string; format?: string; category?: string; categories?: string[] };
type CategoryOpt = { _id: string; name: string; slug?: string };

/** Sections that have their own page and never get a front-page row. */
const NO_ROW = new Set(["women-in-business", "magazine"]);

type HomepageConfig = {
  heroArticle: string | null;
  featuredArticles: string[];
  coverStory: string | null;
  briefingArticles: string[];
  interviewArticle: string | null;
  categoryRails: string[];
  /** Stories pinned to each section row, keyed by category id. */
  railArticles: Record<string, string[]>;
  moreArticles: string[];
  leaderArticles: string[];
  showAds: boolean;
  showNewsletter: boolean;
  showAdvertiseBand: boolean;
};

function normalize(raw: Record<string, unknown>): HomepageConfig {
  const id = (v: unknown) =>
    v && typeof v === "object" && "_id" in v ? String((v as { _id: unknown })._id) : v ? String(v) : null;
  const ids = (v: unknown) => (Array.isArray(v) ? v.map(id).filter(Boolean) as string[] : []);
  return {
    heroArticle: id(raw.heroArticle),
    featuredArticles: ids(raw.featuredArticles),
    coverStory: id(raw.coverStory),
    briefingArticles: ids(raw.briefingArticles),
    interviewArticle: id(raw.interviewArticle),
    categoryRails: ids(raw.categoryRails),
    railArticles: Object.fromEntries(
      Object.entries((raw.railArticles as Record<string, unknown>) || {}).map(([key, value]) => [key, ids(value)]),
    ),
    moreArticles: ids(raw.moreArticles),
    leaderArticles: ids(raw.leaderArticles),
    showAds: raw.showAds !== false,
    showNewsletter: raw.showNewsletter !== false,
    showAdvertiseBand: raw.showAdvertiseBand !== false,
  };
}

function MultiPick({
  label,
  hint,
  values,
  onChange,
  options,
  max,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: Array<{ _id: string; title?: string; name?: string }>;
  max: number;
}) {
  return (
    <div>
      <span className="admin-label">
        {label} <span className="normal-case text-muted">({values.length}/{max})</span>
      </span>
      {hint ? <p className="mb-2 font-sans text-[0.72rem] text-muted">{hint}</p> : null}
      <div className="max-h-56 space-y-1 overflow-y-auto border border-rule bg-white p-2">
        {options.map((opt) => {
          const checked = values.includes(opt._id);
          const idx = values.indexOf(opt._id);
          return (
            <button
              key={opt._id}
              type="button"
              onClick={() => {
                if (checked) onChange(values.filter((v) => v !== opt._id));
                else if (values.length < max) onChange([...values, opt._id]);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-left font-sans text-[0.82rem] transition-colors",
                checked ? "bg-ink text-white" : "hover:bg-paper-2",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-[0.6rem] tabular-nums",
                  checked ? "border-white/60" : "border-rule",
                )}
              >
                {checked ? idx + 1 : ""}
              </span>
              <span className="truncate">{opt.title || opt.name}</span>
            </button>
          );
        })}
      </div>
      {values.length > 1 ? (
        <div className="mt-3">
          <p className="mb-1.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted">
            Order on the page
          </p>
          <ol className="space-y-1">
            {values.map((id, index) => {
              const opt = options.find((o) => o._id === id);
              const move = (to: number) => {
                const next = [...values];
                next.splice(to, 0, next.splice(index, 1)[0]);
                onChange(next);
              };
              return (
                <li key={id} className="flex items-center gap-2 border border-rule bg-paper-2 px-2 py-1.5 font-sans text-[0.8rem]">
                  <span className="w-5 shrink-0 text-center tabular-nums text-muted">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{opt?.title || opt?.name || "Unpublished story"}</span>
                  <button
                    type="button"
                    onClick={() => move(index - 1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="flex h-6 w-6 items-center justify-center border border-rule bg-white hover:border-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index + 1)}
                    disabled={index === values.length - 1}
                    aria-label="Move down"
                    className="flex h-6 w-6 items-center justify-center border border-rule bg-white hover:border-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function Step({
  n,
  title,
  children,
  wide,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={cn("border border-rule bg-white p-6", wide && "lg:col-span-2")}>
      <h2 className="mb-4 flex items-center gap-3 font-sans text-[0.95rem] font-semibold text-ink">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.72rem] text-white tabular-nums">
          {n}
        </span>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

const TOGGLES = [
  ["showNewsletter", "Newsletter card", "\u201cStay Informed\u201d, beside Latest Articles."],
  ["showAds", "Advertising", "Every ad slot on the homepage."],
  ["showAdvertiseBand", "\u201cAdvertise with us\u201d band", "Below Latest Articles when no leaderboard ad is booked."],
] as const;

export default function HomepageAdminPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [articles, setArticles] = useState<ArticleOpt[]>([]);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);
  const [issueSlugs, setIssueSlugs] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const { toast, element } = useToast();

  useEffect(() => {
    api<{
      homepage: Record<string, unknown>;
      articles: ArticleOpt[];
      categories: CategoryOpt[];
      issueSlugs?: string[];
    }>("/api/admin/homepage").then((d) => {
      setConfig(normalize(d.homepage));
      setArticles(d.articles);
      setCategories(d.categories);
      setIssueSlugs(d.issueSlugs || []);
    });
  }, []);

  async function save() {
    if (!config) return;
    setBusy(true);
    try {
      await api("/api/admin/homepage", { method: "PUT", body: JSON.stringify(config) });
      toast("Front page updated.");
    } finally {
      setBusy(false);
    }
  }

  if (!config) return <AdminLoader />;

  const set = <K extends keyof HomepageConfig>(k: K, v: HomepageConfig[K]) =>
    setConfig({ ...config, [k]: v });

  // Magazine features, in the order set in Admin -> Magazines.
  const issueArticles = issueSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is ArticleOpt => Boolean(a));
  const rowSections = categories.filter((c) => !NO_ROW.has(c.slug || ""));
  const rails = config.categoryRails.filter((id) => rowSections.some((c) => c._id === id));

  const magazinesLink = (
    <Link href="/admin/magazines" className="font-semibold text-ink underline">
      Magazines
    </Link>
  );

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Front Page</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            The homepage, top to bottom. Pick stories and set their order; any empty place fills
            with the newest eligible story.
          </p>
        </div>
        <button type="button" onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Saving…" : "Save front page"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Step n={1} title="Latest Editions carousel">
          <p className="border border-rule bg-paper-2 p-3 font-sans text-[0.8rem] text-ink-soft">
            The 3D cover carousel at the top shows every magazine issue, featured issue in front.
            Set the order and the featured issue in {magazinesLink}.
          </p>
        </Step>

        <Step n={2} title="Leaders in Focus">
          <MultiPick
            label="Magazine features"
            hint="Three profile cards. Empty places fill with the next issues in the magazine order."
            values={config.leaderArticles.filter((id) => issueArticles.some((a) => a._id === id))}
            onChange={(v) => set("leaderArticles", v)}
            options={issueArticles}
            max={3}
          />
        </Step>

        <Step n={3} title="Must Read">
          <MultiPick
            label="Stories"
            hint="The list beside Leaders in Focus. Empty places fill with the most-read stories."
            values={config.featuredArticles}
            onChange={(v) => set("featuredArticles", v)}
            options={articles}
            max={4}
          />
        </Step>

        <Step n={4} title="Latest Articles">
          <MultiPick
            label="Stories"
            hint="Two rows of three. Empty places fill with the newest stories."
            values={config.briefingArticles}
            onChange={(v) => set("briefingArticles", v)}
            options={articles}
            max={6}
          />
        </Step>

        <Step n={5} title="Newsletter, ads & partnerships band">
          {TOGGLES.map(([key, label, hint]) => (
            <button
              key={key}
              type="button"
              onClick={() => set(key, !config[key])}
              className="flex w-full items-start justify-between gap-4 border-b border-rule pb-3 text-left last:border-b-0"
            >
              <span>
                <span className="block font-sans text-[0.875rem] font-medium">{label}</span>
                <span className="block font-sans text-[0.75rem] text-muted">{hint}</span>
              </span>
              <span
                className={cn(
                  "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                  config[key] ? "bg-ink" : "bg-rule",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                    config[key] ? "translate-x-[18px]" : "translate-x-[3px]",
                  )}
                />
              </span>
            </button>
          ))}
        </Step>

        <Step n={6} title="Section rows" wide>
          <MultiPick
            label="Sections, in order"
            hint="Each gets a row of four stories. Women in Business and Magazine have their own pages, so they never get a row."
            values={rails}
            onChange={(v) => set("categoryRails", v)}
            options={rowSections}
            max={6}
          />
          {rails.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {rails.map((categoryId) => {
                const section = rowSections.find((c) => c._id === categoryId);
                if (!section) return null;
                const inSection = articles.filter(
                  (a) => a.category === categoryId || (a.categories || []).includes(categoryId),
                );
                return (
                  <div key={categoryId} className="border border-rule p-4">
                    <MultiPick
                      label={`${section.name} row`}
                      hint="Empty places fill with the section's newest stories."
                      values={config.railArticles[categoryId] || []}
                      onChange={(v) => set("railArticles", { ...config.railArticles, [categoryId]: v })}
                      options={inSection}
                      max={4}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </Step>

        <Step n={7} title="More from PrimeCrest" wide>
          <MultiPick
            label="Stories"
            hint="The last row. Empty places fill with the newest stories not shown above."
            values={config.moreArticles}
            onChange={(v) => set("moreArticles", v)}
            options={articles}
            max={4}
          />
        </Step>
      </div>
    </div>
  );
}
