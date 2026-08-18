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
};

const EMPTY = { name: "", kicker: "", description: "", order: 0 };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState("");
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ items: Category[] }>("/api/admin/categories")
      .then((d) => setItems(d.items))
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
        setItems((prev) => prev.map((c) => (c._id === d.item._id ? d.item : c)));
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
          <div className="relative w-full max-w-md border border-rule bg-white p-6 shadow-2xl animate-in">
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
