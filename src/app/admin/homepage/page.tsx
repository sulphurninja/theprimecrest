"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { AdminLoader, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type ArticleOpt = { _id: string; title: string; format?: string; category?: string; categories?: string[] };
type CategoryOpt = { _id: string; name: string };

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
    showAds: raw.showAds !== false,
    showNewsletter: raw.showNewsletter !== false,
    showAdvertiseBand: raw.showAdvertiseBand !== false,
  };
}

function ArticleSelect({
  label,
  hint,
  value,
  onChange,
  articles,
}: {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (v: string | null) => void;
  articles: ArticleOpt[];
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="admin-input"
      >
        <option value="">Automatic (latest eligible)</option>
        {articles.map((a) => (
          <option key={a._id} value={a._id}>
            {a.title}
          </option>
        ))}
      </select>
      {hint ? <span className="mt-1 block font-sans text-[0.72rem] text-muted">{hint}</span> : null}
    </label>
  );
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

export default function HomepageAdminPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [articles, setArticles] = useState<ArticleOpt[]>([]);
  const [categories, setCategories] = useState<CategoryOpt[]>([]);
  const [busy, setBusy] = useState(false);
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ homepage: Record<string, unknown>; articles: ArticleOpt[]; categories: CategoryOpt[] }>(
      "/api/admin/homepage",
    ).then((d) => {
      setConfig(normalize(d.homepage));
      setArticles(d.articles);
      setCategories(d.categories);
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

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Front Page</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            Compose tomorrow&apos;s front page. Anything left automatic falls back to the
            latest eligible story.
          </p>
        </div>
        <button type="button" onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Saving…" : "Save front page"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 border border-rule bg-white p-6">
          <h2 className="section-title">Lead & anchors</h2>
          <p className="border border-rule bg-paper-2 p-3 font-sans text-[0.8rem] text-ink-soft">
            The lead carousel and &ldquo;Leaders in focus&rdquo; show the magazine issues. Set their
            order in{" "}
            <Link href="/admin/magazines" className="font-semibold text-ink underline">
              Magazines
            </Link>
            .
          </p>
          <ArticleSelect
            label="The Interview"
            value={config.interviewArticle}
            onChange={(v) => set("interviewArticle", v)}
            articles={articles.filter((a) => a.format === "interview").length
              ? articles.filter((a) => a.format === "interview")
              : articles}
          />
        </div>

        <div className="space-y-5 border border-rule bg-white p-6">
          <h2 className="section-title">Page furniture</h2>
          {(
            [
              ["showAds", "Show advertising", "Reserved slots render the house ad when unsold."],
              ["showNewsletter", "Show newsletter signup", "The Morning Letter module."],
              ["showAdvertiseBand", "Show the advertise band", "The dark band near the footer."],
            ] as const
          ).map(([key, label, hint]) => (
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
        </div>

        <div className="border border-rule bg-white p-6">
          <MultiPick
            label="Must Read"
            hint="The panel beside the lead carousel. Leave empty to show the most-read stories."
            values={config.featuredArticles}
            onChange={(v) => set("featuredArticles", v)}
            options={articles}
            max={5}
          />
        </div>

        <div className="border border-rule bg-white p-6">
          <MultiPick
            label="Top story & latest"
            hint="The first is the Top Story panel; the rest fill the row beneath it. Leave empty for the newest stories."
            values={config.briefingArticles}
            onChange={(v) => set("briefingArticles", v)}
            options={articles}
            max={4}
          />
        </div>

        <div className="border border-rule bg-white p-6 lg:col-span-2">
          <MultiPick
            label="Section rails"
            hint="Which sections get a row on the front page."
            values={config.categoryRails}
            onChange={(v) => set("categoryRails", v)}
            options={categories}
            max={6}
          />
        </div>

        {config.categoryRails.map((categoryId) => {
          const section = categories.find((c) => c._id === categoryId);
          if (!section) return null;
          const inSection = articles.filter(
            (a) => a.category === categoryId || (a.categories || []).includes(categoryId),
          );
          return (
            <div key={categoryId} className="border border-rule bg-white p-6">
              <MultiPick
                label={`${section.name} row`}
                hint="Stories for this row, in order. Empty places fill with the section's newest stories."
                values={config.railArticles[categoryId] || []}
                onChange={(v) => set("railArticles", { ...config.railArticles, [categoryId]: v })}
                options={inSection}
                max={4}
              />
            </div>
          );
        })}

        <div className="border border-rule bg-white p-6">
          <MultiPick
            label="More from PrimeCrest"
            hint="The last row of stories. Empty places fill with the newest stories not shown above."
            values={config.moreArticles}
            onChange={(v) => set("moreArticles", v)}
            options={articles}
            max={4}
          />
        </div>
      </div>
    </div>
  );
}
