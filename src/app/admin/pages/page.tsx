"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminLoader, StatusPill, useToast } from "@/components/admin/ui";

type PageDoc = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
};

const EMPTY: PageDoc = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  published: true,
};

export default function PagesAdmin() {
  const [items, setItems] = useState<PageDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PageDoc | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ items: PageDoc[] }>("/api/admin/pages")
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!editing?.title) return;
    setBusy(true);
    setError("");
    try {
      if (editing._id) {
        const d = await api<{ item: PageDoc }>(`/api/admin/pages/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(editing),
        });
        setItems((prev) => prev.map((p) => (p._id === d.item._id ? d.item : p)));
      } else {
        const d = await api<{ item: PageDoc }>("/api/admin/pages", {
          method: "POST",
          body: JSON.stringify(editing),
        });
        setItems((prev) => [...prev, d.item]);
      }
      setEditing(null);
      toast("Page saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <AdminLoader />;

  if (editing) {
    return (
      <div>
        {element}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="headline text-[1.7rem]">
            {editing._id ? `Edit: ${editing.title}` : "New page"}
          </h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => setEditing(null)} className="btn-outline">
              Back
            </button>
            <button type="button" onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
              {busy ? "Saving…" : "Save page"}
            </button>
          </div>
        </header>
        {error ? <p className="mb-4 font-sans text-[0.82rem] text-accent">{error}</p> : null}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="Page title"
              className="headline w-full border-b-2 border-rule bg-transparent pb-3 text-[1.8rem] outline-none focus:border-ink"
            />
            <RichTextEditor
              content={editing.content}
              onChange={(html) => setEditing({ ...editing, content: html })}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-4 border border-rule bg-white p-5">
              <label>
                <span className="admin-label">Slug</span>
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="about"
                  className="admin-input font-mono text-[0.82rem]"
                />
              </label>
              <label>
                <span className="admin-label">Excerpt</span>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  rows={2}
                  className="admin-input resize-none"
                />
              </label>
              <label>
                <span className="admin-label">SEO title</span>
                <input
                  value={editing.seoTitle}
                  onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label>
                <span className="admin-label">SEO description</span>
                <textarea
                  value={editing.seoDescription}
                  onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                />
              </label>
              <button
                type="button"
                onClick={() => setEditing({ ...editing, published: !editing.published })}
                className="btn-outline w-full"
              >
                {editing.published ? "Published — click to unpublish" : "Draft — click to publish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Pages</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            About, privacy, terms — the standing pages of the site.
          </p>
        </div>
        <button type="button" onClick={() => setEditing(EMPTY)} className="btn-primary">
          New page
        </button>
      </header>

      <div className="border border-rule bg-white">
        <ul className="divide-y divide-rule">
          {items.map((page) => (
            <li key={page._id}>
              <button
                type="button"
                onClick={() => setEditing(page)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-2"
              >
                <div>
                  <p className="font-serif font-medium">{page.title}</p>
                  <p className="mt-0.5 font-mono text-[0.72rem] text-muted">/{page.slug}</p>
                </div>
                <StatusPill status={page.published ? "published" : "draft"} />
              </button>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="px-5 py-14 text-center font-sans text-[0.875rem] text-muted">
              No pages yet.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
