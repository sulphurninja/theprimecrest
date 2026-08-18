"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { ImageField } from "@/components/admin/MediaPicker";
import { AdminLoader, useToast } from "@/components/admin/ui";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  slug: string;
  title?: string;
  bio?: string;
  avatar?: string;
};

type NewUser = {
  name: string;
  email: string;
  password: string;
  role: string;
  title: string;
  bio: string;
  avatar: string;
};

const EMPTY: NewUser = {
  name: "",
  email: "",
  password: "",
  role: "author",
  title: "Staff Writer",
  bio: "",
  avatar: "",
};

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<NewUser | null>(null);
  const [error, setError] = useState("");
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ items: User[] }>("/api/admin/users")
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!creating) return;
    setError("");
    try {
      const d = await api<{ item: User }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(creating),
      });
      setItems((prev) => [...prev, d.item].sort((a, b) => a.name.localeCompare(b.name)));
      setCreating(null);
      toast("Team member added.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    }
  }

  if (loading) return <AdminLoader />;

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">The Team</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            Editors, writers, and administrators of the newsroom.
          </p>
        </div>
        <button type="button" onClick={() => setCreating(EMPTY)} className="btn-primary">
          Add member
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((user) => (
          <div key={user._id} className="flex gap-4 border border-rule bg-white p-5">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg text-white">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-sans text-[0.95rem] font-semibold">{user.name}</p>
              <p className="truncate font-sans text-[0.78rem] text-muted">{user.email}</p>
              <p className="mt-1 font-sans text-[0.75rem]">
                <span className="capitalize text-accent">{user.role}</span>
                {user.title ? <span className="text-muted"> · {user.title}</span> : null}
              </p>
            </div>
          </div>
        ))}
      </div>

      {creating ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setCreating(null)} />
          <div className="relative max-h-[88vh] w-full max-w-md overflow-y-auto border border-rule bg-white p-6 shadow-2xl animate-in">
            <h2 className="headline mb-5 text-[1.4rem]">Add a team member</h2>
            <div className="grid gap-4">
              <label>
                <span className="admin-label">Full name</span>
                <input
                  value={creating.name}
                  onChange={(e) => setCreating({ ...creating, name: e.target.value })}
                  className="admin-input"
                  autoFocus
                />
              </label>
              <label>
                <span className="admin-label">Email</span>
                <input
                  type="email"
                  value={creating.email}
                  onChange={(e) => setCreating({ ...creating, email: e.target.value })}
                  className="admin-input"
                />
              </label>
              <label>
                <span className="admin-label">Password</span>
                <input
                  type="password"
                  value={creating.password}
                  onChange={(e) => setCreating({ ...creating, password: e.target.value })}
                  className="admin-input"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="admin-label">Role</span>
                  <select
                    value={creating.role}
                    onChange={(e) => setCreating({ ...creating, role: e.target.value })}
                    className="admin-input capitalize"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                  </select>
                </label>
                <label>
                  <span className="admin-label">Job title</span>
                  <input
                    value={creating.title}
                    onChange={(e) => setCreating({ ...creating, title: e.target.value })}
                    className="admin-input"
                  />
                </label>
              </div>
              <label>
                <span className="admin-label">Bio</span>
                <textarea
                  value={creating.bio}
                  onChange={(e) => setCreating({ ...creating, bio: e.target.value })}
                  rows={3}
                  className="admin-input resize-none"
                />
              </label>
              <ImageField
                label="Portrait"
                value={creating.avatar}
                onChange={(url) => setCreating({ ...creating, avatar: url })}
              />
            </div>
            {error ? <p className="mt-3 font-sans text-[0.8rem] text-accent">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setCreating(null)} className="btn-outline">
                Cancel
              </button>
              <button type="button" onClick={save} className="btn-primary">
                Add member
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
