"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/components/admin/api";
import { AdminLoader, ConfirmButton, StatusPill, useToast } from "@/components/admin/ui";
import { formatDate, cn } from "@/lib/utils";

type Row = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  featured?: boolean;
  isHero?: boolean;
  isCoverStory?: boolean;
  publishedAt?: string;
  updatedAt: string;
  views?: number;
  author?: { name: string };
  category?: { name: string };
};

const FILTERS = ["all", "published", "draft", "scheduled", "archived"] as const;

function ArticlesInner() {
  const params = useSearchParams();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(params.get("status") || "all");
  const [q, setQ] = useState("");
  const { toast, element } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const search = new URLSearchParams();
    if (status !== "all") search.set("status", status);
    if (q.trim()) search.set("q", q.trim());
    try {
      const data = await api<{ items: Row[] }>(`/api/admin/articles?${search}`);
      setRows(data.items);
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  async function remove(id: string) {
    await api(`/api/admin/articles/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((r) => r._id !== id));
    toast("Article deleted.");
  }

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Articles</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            Everything filed, drafted, and archived.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          Write a story
        </Link>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded border border-rule bg-white">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatus(f)}
              className={cn(
                "px-3.5 py-2 font-sans text-[0.8rem] capitalize transition-colors",
                status === f ? "bg-ink font-medium text-white" : "text-ink-soft hover:bg-paper-2",
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search titles…"
          className="admin-input max-w-xs"
        />
      </div>

      {loading ? (
        <AdminLoader />
      ) : (
        <div className="overflow-x-auto border border-rule bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule bg-paper-2/60">
                {["Story", "Section", "Author", "Status", "Published", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {rows.map((row) => (
                <tr key={row._id} className="transition-colors hover:bg-paper-2/50">
                  <td className="max-w-md px-4 py-3.5">
                    <Link
                      href={`/admin/articles/${row._id}`}
                      className="font-serif font-medium no-underline hover:text-accent"
                    >
                      {row.title}
                    </Link>
                    <div className="mt-1 flex gap-2">
                      {row.isHero ? <span className="font-sans text-[0.66rem] font-semibold uppercase tracking-wide text-accent">Lead</span> : null}
                      {row.isCoverStory ? <span className="font-sans text-[0.66rem] font-semibold uppercase tracking-wide text-accent">Cover</span> : null}
                      {row.featured ? <span className="font-sans text-[0.66rem] font-semibold uppercase tracking-wide text-muted">Featured</span> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-sans text-[0.85rem] text-ink-soft">
                    {row.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3.5 font-sans text-[0.85rem] text-ink-soft">
                    {row.author?.name || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-4 py-3.5 font-sans text-[0.82rem] text-muted">
                    {row.publishedAt ? formatDate(row.publishedAt) : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {row.status === "published" ? (
                        <a
                          href={`/story/${row.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-sans text-[0.78rem] text-muted no-underline hover:text-ink"
                        >
                          View
                        </a>
                      ) : null}
                      <ConfirmButton onConfirm={() => remove(row._id)}>Delete</ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center font-sans text-[0.875rem] text-muted">
                    Nothing matches. Adjust the filters or write something new.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <ArticlesInner />
    </Suspense>
  );
}
