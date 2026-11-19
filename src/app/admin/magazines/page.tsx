"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Star } from "lucide-react";
import { api } from "@/components/admin/api";
import { AdminLoader, useToast } from "@/components/admin/ui";
import { issueLabel, type MagazineIssue } from "@/lib/magazines";
import { cn } from "@/lib/utils";

/** Move the item at `from` to `to`, returning a new array. */
function moved<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function MagazinesAdminPage() {
  const [issues, setIssues] = useState<MagazineIssue[] | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ issues: MagazineIssue[] }>("/api/admin/magazines").then((d) => setIssues(d.issues));
  }, []);

  function reorder(from: number, to: number) {
    if (!issues || from === to || to < 0 || to >= issues.length) return;
    setIssues(moved(issues, from, to));
    setDirty(true);
  }

  async function save() {
    if (!issues) return;
    setBusy(true);
    try {
      await api("/api/admin/magazines", {
        method: "PUT",
        body: JSON.stringify({ order: issues.map((issue) => issue.articleSlug) }),
      });
      setDirty(false);
      toast("Magazine order saved.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the order.");
    } finally {
      setBusy(false);
    }
  }

  if (!issues) return <AdminLoader />;

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Magazines</h1>
          <p className="mt-1 max-w-2xl font-sans text-[0.875rem] text-muted">
            Drag issues, or use the arrows, to set the order they appear in across the site. The
            issue at the top is the featured one. To add an issue, open its story in{" "}
            <Link href="/admin/articles" className="underline">
              Articles
            </Link>{" "}
            and switch on Digital magazine with a cover.
          </p>
        </div>
        <button type="button" onClick={save} disabled={busy || !dirty} className="btn-primary disabled:opacity-50">
          {busy ? "Saving…" : dirty ? "Save order" : "Saved"}
        </button>
      </header>

      <div className="mb-6 grid gap-3 border border-rule bg-white p-5 font-sans text-[0.82rem] text-ink-soft sm:grid-cols-3">
        <p>
          <strong className="text-ink">Position 1, featured:</strong> leads the homepage carousel and
          the Magazine page, and is &ldquo;This month&apos;s cover&rdquo; everywhere.
        </p>
        <p>
          <strong className="text-ink">Positions 2 to 5:</strong> the &ldquo;Leaders in focus&rdquo;
          cards on the homepage.
        </p>
        <p>
          <strong className="text-ink">Everything:</strong> the carousel, the &ldquo;Latest
          editions&rdquo; shelf and the Magazine page follow this order. New issues appear at the top
          until you place them.
        </p>
      </div>

      {issues.length === 0 ? (
        <p className="border border-rule bg-white p-10 text-center font-sans text-muted">
          No magazine issues yet.
        </p>
      ) : (
        <ol className="space-y-2">
          {issues.map((issue, index) => (
            <li
              key={issue.articleSlug}
              draggable
              onDragStart={() => setDragging(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging !== null) reorder(dragging, index);
                setDragging(null);
              }}
              onDragEnd={() => setDragging(null)}
              className={cn(
                "flex items-center gap-4 border bg-white p-3 transition-colors",
                index === 0 ? "border-ink" : "border-rule",
                dragging === index && "opacity-40",
              )}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted" aria-hidden />
              <span className="w-6 shrink-0 text-center font-sans text-[0.85rem] font-semibold tabular-nums text-muted">
                {index + 1}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={issue.cover} alt="" className="h-[72px] w-[54px] shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[0.95rem] font-semibold text-ink">{issue.name}</p>
                <p className="truncate font-sans text-[0.8rem] text-muted">
                  {[issueLabel(issue), issue.role].filter(Boolean).join(" · ")}
                </p>
              </div>
              {index === 0 ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 bg-ink px-2.5 py-1 font-sans text-[0.68rem] font-bold uppercase tracking-[0.1em] text-white">
                  <Star className="h-3 w-3" /> Featured
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => reorder(index, 0)}
                  className="shrink-0 border border-rule px-2.5 py-1 font-sans text-[0.72rem] font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  Make featured
                </button>
              )}
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => reorder(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move ${issue.name} up`}
                  className="flex h-8 w-8 items-center justify-center border border-rule text-ink-soft hover:border-ink disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => reorder(index, index + 1)}
                  disabled={index === issues.length - 1}
                  aria-label={`Move ${issue.name} down`}
                  className="flex h-8 w-8 items-center justify-center border border-rule text-ink-soft hover:border-ink disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
