"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { ImageField } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useToast } from "@/components/admin/ui";
import { slugify, cn } from "@/lib/utils";

type Option = { _id: string; name: string };

export type ArticleFormValue = {
  _id?: string;
  title: string;
  slug: string;
  dek: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverCaption: string;
  coverCredit: string;
  ogImage: string;
  category: string;
  author: string;
  tags: string[];
  status: string;
  publishedAt: string;
  featured: boolean;
  isHero: boolean;
  isCoverStory: boolean;
  format: string;
  allowAds: boolean;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  pullQuote: { text: string; attribution: string };
};

export const EMPTY_ARTICLE: ArticleFormValue = {
  title: "",
  slug: "",
  dek: "",
  excerpt: "",
  content: "",
  coverImage: "",
  coverCaption: "",
  coverCredit: "",
  ogImage: "",
  category: "",
  author: "",
  tags: [],
  status: "draft",
  publishedAt: "",
  featured: false,
  isHero: false,
  isCoverStory: false,
  format: "standard",
  allowAds: true,
  seoTitle: "",
  seoDescription: "",
  noIndex: false,
  pullQuote: { text: "", attribution: "" },
};

const FORMATS = ["standard", "feature", "brief", "interview", "essay", "photo"];
const STATUSES = ["draft", "published", "scheduled", "archived"];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block font-sans text-[0.72rem] text-muted">{hint}</span> : null}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 py-1.5 text-left"
    >
      <span>
        <span className="block font-sans text-[0.85rem] font-medium">{label}</span>
        {hint ? <span className="block font-sans text-[0.72rem] text-muted">{hint}</span> : null}
      </span>
      <span
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-ink" : "bg-rule",
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[3px]",
          )}
        />
      </span>
    </button>
  );
}

export function ArticleForm({ initial }: { initial: ArticleFormValue }) {
  const router = useRouter();
  const { toast, element } = useToast();
  const [value, setValue] = useState<ArticleFormValue>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial._id));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    Promise.all([
      api<{ items: Option[] }>("/api/admin/categories"),
      api<{ items: Option[] }>("/api/admin/users"),
    ])
      .then(([cats, users]) => {
        setCategories(cats.items);
        setAuthors(users.items);
        setValue((v) => ({
          ...v,
          category: v.category || cats.items[0]?._id || "",
          author: v.author || users.items[0]?._id || "",
        }));
      })
      .catch(() => {});
  }, []);

  function set<K extends keyof ArticleFormValue>(key: K, val: ArticleFormValue[K]) {
    setValue((v) => ({ ...v, [key]: val }));
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !value.tags.includes(tag)) set("tags", [...value.tags, tag]);
    setTagInput("");
  }

  async function save(statusOverride?: string) {
    setBusy(true);
    setError("");
    const payload = {
      ...value,
      status: statusOverride || value.status,
      slug: value.slug || slugify(value.title),
      publishedAt: value.publishedAt || undefined,
    };
    try {
      if (value._id) {
        await api(`/api/admin/articles/${value._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (statusOverride) set("status", statusOverride);
        toast(statusOverride === "published" ? "Published." : "Saved.");
      } else {
        const data = await api<{ item: { _id: string } }>("/api/admin/articles", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast("Created.");
        router.replace(`/admin/articles/${data.item._id}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {element}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="headline text-[1.7rem]">
            {value._id ? "Edit story" : "New story"}
          </h1>
          {error ? <p className="mt-1 font-sans text-[0.82rem] text-accent">{error}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {value._id && value.status === "published" ? (
            <a
              href={`/story/${value.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[0.82rem] text-muted no-underline hover:text-ink"
            >
              View live →
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => save()}
            disabled={busy || !value.title}
            className="btn-outline disabled:opacity-50"
          >
            Save
          </button>
          {value.status !== "published" ? (
            <button
              type="button"
              onClick={() => save("published")}
              disabled={busy || !value.title}
              className="btn-primary disabled:opacity-50"
            >
              {busy ? "Working…" : "Publish"}
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 xl:col-span-2">
          <input
            value={value.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            placeholder="Headline"
            className="headline w-full border-b-2 border-rule bg-transparent pb-3 text-[2rem] outline-none transition-colors placeholder:text-muted/50 focus:border-ink"
          />
          <textarea
            value={value.dek}
            onChange={(e) => set("dek", e.target.value)}
            placeholder="Dek — the sentence under the headline that earns the click honestly."
            rows={2}
            className="dek w-full resize-none border-b border-rule bg-transparent pb-2 outline-none placeholder:text-muted/50 focus:border-ink"
          />
          <RichTextEditor content={value.content} onChange={(html) => set("content", html)} />

          <div className="border border-rule bg-white p-5">
            <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Pull quote (optional)
            </h2>
            <div className="grid gap-4">
              <Field label="Quote">
                <input
                  value={value.pullQuote.text}
                  onChange={(e) => set("pullQuote", { ...value.pullQuote, text: e.target.value })}
                  className="admin-input"
                />
              </Field>
              <Field label="Attribution">
                <input
                  value={value.pullQuote.attribution}
                  onChange={(e) =>
                    set("pullQuote", { ...value.pullQuote, attribution: e.target.value })
                  }
                  className="admin-input"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="border border-rule bg-white p-5">
            <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Publishing
            </h2>
            <div className="grid gap-4">
              <Field label="Status">
                <select
                  value={value.status}
                  onChange={(e) => set("status", e.target.value)}
                  className="admin-input capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Publish date" hint="Leave empty to use the moment you hit Publish.">
                <input
                  type="datetime-local"
                  value={value.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="Section">
                <select
                  value={value.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="admin-input"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Author">
                <select
                  value={value.author}
                  onChange={(e) => set("author", e.target.value)}
                  className="admin-input"
                >
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Format">
                <select
                  value={value.format}
                  onChange={(e) => set("format", e.target.value)}
                  className="admin-input capitalize"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 border-t border-rule pt-3">
              <Toggle
                label="Lead story"
                hint="Candidate for the homepage lead."
                checked={value.isHero}
                onChange={(v) => set("isHero", v)}
              />
              <Toggle
                label="Cover story"
                hint="Candidate for the cover story band."
                checked={value.isCoverStory}
                onChange={(v) => set("isCoverStory", v)}
              />
              <Toggle
                label="Featured"
                hint="Eligible for The Latest rail."
                checked={value.featured}
                onChange={(v) => set("featured", v)}
              />
              <Toggle
                label="Allow advertising"
                hint="Turn off for sensitive stories."
                checked={value.allowAds}
                onChange={(v) => set("allowAds", v)}
              />
            </div>
          </div>

          <div className="border border-rule bg-white p-5">
            <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Cover art
            </h2>
            <div className="grid gap-4">
              <ImageField
                label="Cover image"
                value={value.coverImage}
                onChange={(url) => set("coverImage", url)}
              />
              <Field label="Caption">
                <input
                  value={value.coverCaption}
                  onChange={(e) => set("coverCaption", e.target.value)}
                  className="admin-input"
                />
              </Field>
              <Field label="Credit">
                <input
                  value={value.coverCredit}
                  onChange={(e) => set("coverCredit", e.target.value)}
                  placeholder="Photograph by …"
                  className="admin-input"
                />
              </Field>
            </div>
          </div>

          <div className="border border-rule bg-white p-5">
            <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              Tags
            </h2>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag, press Enter"
                className="admin-input"
              />
            </div>
            {value.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {value.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => set("tags", value.tags.filter((t) => t !== tag))}
                    className="border border-rule px-2.5 py-1 font-sans text-[0.78rem] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                    title="Remove"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border border-rule bg-white p-5">
            <h2 className="mb-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
              SEO & sharing
            </h2>
            <div className="grid gap-4">
              <Field label="URL slug">
                <input
                  value={value.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  className="admin-input font-mono text-[0.82rem]"
                />
              </Field>
              <Field label="SEO title" hint={`${(value.seoTitle || value.title).length}/60`}>
                <input
                  value={value.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={value.title}
                  className="admin-input"
                />
              </Field>
              <Field
                label="Meta description"
                hint={`${(value.seoDescription || value.excerpt).length}/160`}
              >
                <textarea
                  value={value.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Custom excerpt" hint="Used on cards and in search. Auto-generated if empty.">
                <textarea
                  value={value.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                />
              </Field>
              <ImageField
                label="Social share image (defaults to cover)"
                value={value.ogImage}
                onChange={(url) => set("ogImage", url)}
              />
              <Toggle
                label="Hide from search engines"
                checked={value.noIndex}
                onChange={(v) => set("noIndex", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
