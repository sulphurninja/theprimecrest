"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { AdminLoader, ConfirmButton, useToast } from "@/components/admin/ui";

type Category = {
  _id: string;
  name: string;
  slug: string;
  kicker?: string;
  description?: string;
  order: number;
  magazines?: string[];
  showMagazineShelf?: boolean;
  pinnedArticles?: string[];
};

type Ref = string | { _id: string };
type ArticleOption = {
  _id: string;
  title: string;
  slug: string;
  status?: string;
  magazineEnabled?: boolean;
  magazineUrl?: string;
  category?: Ref | null;
  categories?: Ref[];
};

const refId = (ref: Ref | null | undefined) => (ref ? (typeof ref === "string" ? ref : String(ref._id)) : "");

const EMPTY = {
  name: "",
  kicker: "",
  description: "",
  order: 0,
  magazines: [] as string[],
  showMagazineShelf: true,
  pinnedArticles: [] as string[],
};

/** Stories pinned to the top of a section, in order: tick to add, arrows to reorder. */
function PinnedPicker({
  values,
  options,
  onChange,
}: {
  values: string[];
  options: ArticleOption[];
  onChange: (next: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const shown = options.filter((a) => a.title.toLowerCase().includes(query.trim().toLowerCase()));
  const move = (index: number, to: number) => {
    const next = [...values];
    next.splice(to, 0, next.splice(index, 1)[0]);
    onChange(next);
  };
  return (
    <div>
      {values.length ? (
        <ol className="mb-2 space-y-1">
          {values.map((id, index) => {
            const article = options.find((a) => a._id === id);
            return (
              <li key={id} className="flex items-center gap-2 border border-rule bg-paper-2 px-2 py-1.5 font-sans text-[0.8rem]">
                <span className="w-5 shrink-0 text-center tabular-nums text-muted">{index + 1}</span>
                <span className="min-w-0 flex-1 truncate">{article?.title || "Story no longer in this section"}</span>
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="flex h-6 w-6 items-center justify-center border border-rule bg-white hover:border-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === values.length - 1}
                  aria-label="Move down"
                  className="flex h-6 w-6 items-center justify-center border border-rule bg-white hover:border-ink disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(values.filter((v) => v !== id))}
                  aria-label="Unpin"
                  className="flex h-6 w-6 items-center justify-center border border-rule bg-white hover:border-ink"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories in this section"
        className="admin-input mb-1.5"
      />
      <div className="grid max-h-44 gap-1 overflow-y-auto border border-rule p-2">
        {shown.length ? (
          shown.map((article) => {
            const pinned = values.includes(article._id);
            return (
              <label key={article._id} className="flex cursor-pointer items-start gap-2 px-1 py-1 font-sans text-[0.82rem]">
                <input
                  type="checkbox"
                  className="mt-1 h-3.5 w-3.5 accent-ink"
                  checked={pinned}
                  onChange={() => onChange(pinned ? values.filter((v) => v !== article._id) : [...values, article._id])}
                />
                <span>{article.title}</span>
              </label>
            );
          })
        ) : (
          <p className="px-1 py-1 font-sans text-[0.8rem] text-muted">No published stories in this section yet.</p>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState("");
  const { toast, element } = useToast();

  useEffect(() => {
    Promise.all([
      api<{ items: Category[] }>("/api/admin/categories"),
      api<{ items: ArticleOption[] }>("/api/admin/articles?status=published"),
    ])
      .then(([sections, list]) => {
        setItems(
          sections.items.map((section) => ({
            ...section,
            magazines: (section.magazines || []).map(String),
            pinnedArticles: (section.pinnedArticles || []).map(String),
            showMagazineShelf: section.showMagazineShelf !== false,
          })),
        );
        setArticles(list.items);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!editing?.name) return;
    setError("");
    try {
      if (editing._id) {
        const d = await api<{ item: Category }>(`/api/admin/categories/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(editing),
        });
        const saved = {
          ...d.item,
          magazines: (d.item.magazines || []).map(String),
          pinnedArticles: (d.item.pinnedArticles || []).map(String),
        };
        setItems((prev) => prev.map((c) => (c._id === saved._id ? saved : c)));
      } else {
        const d = await api<{ item: Category }>("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(editing),
        });
        setItems((prev) =>
          [...prev, d.item].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
        );
      }
      setEditing(null);
      toast("Section saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function remove(id: string) {
    await api(`/api/admin/categories/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((c) => c._id !== id));
    toast("Section deleted.");
  }

  if (loading) return <AdminLoader />;

  const magazineOptions = articles.filter((article) => article.magazineEnabled || article.magazineUrl);
  const inSection = editing?._id
    ? articles.filter(
        (a) => refId(a.category) === editing._id || (a.categories || []).some((c) => refId(c) === editing._id),
      )
    : [];

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Sections</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            The desks of the journal. Order controls the navigation.
          </p>
        </div>
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-primary">
          New section
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((cat) => (
          <div key={cat._id} className="border border-rule bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="headline text-[1.3rem]">{cat.name}</h2>
                <p className="mt-0.5 font-mono text-[0.72rem] text-muted">/c/{cat.slug}</p>
              </div>
              <span className="font-sans text-[0.72rem] text-muted">#{cat.order}</span>
            </div>
            {cat.description ? (
              <p className="mt-3 font-serif text-[0.88rem] leading-relaxed text-ink-soft">
                {cat.description}
              </p>
            ) : null}
            <div className="mt-4 flex items-center gap-4 border-t border-rule pt-3">
              <button
                type="button"
                onClick={() => setEditing(cat)}
                className="font-sans text-[0.8rem] font-medium text-ink-soft hover:text-ink"
              >
                Edit
              </button>
              <ConfirmButton onConfirm={() => remove(cat._id)}>Delete</ConfirmButton>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setEditing(null)} />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-rule bg-white p-6 shadow-2xl animate-in">
            <h2 className="headline mb-5 text-[1.4rem]">
              {editing._id ? "Edit section" : "New section"}
            </h2>
            <div className="grid gap-4">
              <label>
                <span className="admin-label">Name</span>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="admin-input"
                  autoFocus
                />
              </label>
              <label>
                <span className="admin-label">Kicker</span>
                <input
                  value={editing.kicker || ""}
                  onChange={(e) => setEditing({ ...editing, kicker: e.target.value })}
                  placeholder="Shown above the section title"
                  className="admin-input"
                />
              </label>
              <label>
                <span className="admin-label">Description</span>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                />
              </label>
              <div>
                <span className="admin-label">Pinned stories</span>
                <p className="mb-2 font-sans text-[0.72rem] text-muted">
                  These lead the section page in this order; everything else follows, newest first.
                </p>
                {editing._id ? (
                  <PinnedPicker
                    values={editing.pinnedArticles || []}
                    options={inSection}
                    onChange={(next) => setEditing({ ...editing, pinnedArticles: next })}
                  />
                ) : (
                  <p className="font-sans text-[0.8rem] text-muted">Save the section first, then pin stories.</p>
                )}
              </div>

              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-ink"
                  checked={editing.showMagazineShelf !== false}
                  onChange={(e) => setEditing({ ...editing, showMagazineShelf: e.target.checked })}
                />
                <span>
                  <span className="block font-sans text-[0.875rem] font-medium">Show the magazine cover shelf</span>
                  <span className="block font-sans text-[0.72rem] text-muted">
                    &ldquo;On the magazine stand&rdquo; covers above the stories. Off: magazine features list as
                    ordinary story cards.
                  </span>
                </span>
              </label>

              {editing.showMagazineShelf !== false ? (
                <div>
                  <span className="admin-label">Magazines on the shelf</span>
                  <p className="mb-2 font-sans text-[0.72rem] text-muted">
                    Any magazine story filed in this section shows automatically. Tick others to add them
                    as well.
                  </p>
                  {magazineOptions.length ? (
                    <div className="grid max-h-48 gap-1.5 overflow-y-auto border border-rule p-2">
                      {magazineOptions.map((article) => {
                        const selected = (editing.magazines || []).includes(article._id);
                        return (
                          <label
                            key={article._id}
                            className="flex cursor-pointer items-start gap-2 px-1 py-1 font-sans text-[0.82rem]"
                          >
                            <input
                              type="checkbox"
                              className="mt-1 h-3.5 w-3.5 accent-ink"
                              checked={selected}
                              onChange={() => {
                                const current = editing.magazines || [];
                                setEditing({
                                  ...editing,
                                  magazines: selected
                                    ? current.filter((id) => id !== article._id)
                                    : [...current, article._id],
                                });
                              }}
                            />
                            <span>{article.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="font-sans text-[0.8rem] text-muted">No magazine stories yet.</p>
                  )}
                </div>
              ) : null}
              <label>
                <span className="admin-label">Order</span>
                <input
                  type="number"
                  value={editing.order ?? 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                  className="admin-input"
                />
              </label>
            </div>
            {error ? <p className="mt-3 font-sans text-[0.8rem] text-accent">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">
                Cancel
              </button>
              <button type="button" onClick={save} className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
