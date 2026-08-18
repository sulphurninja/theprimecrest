"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/site/Logo";
import { api } from "@/components/admin/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-2 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Wordmark className="text-[2rem]" href={null} />
          <p className="mt-2 font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted">
            Newsroom Access
          </p>
        </div>

        <form onSubmit={onSubmit} className="border border-rule bg-white p-7">
          <label className="block">
            <span className="admin-label">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              className="admin-input"
            />
          </label>
          <label className="mt-4 block">
            <span className="admin-label">Password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="admin-input"
            />
          </label>

          {error ? (
            <p className="mt-4 font-sans text-[0.82rem] text-accent">{error}</p>
          ) : null}

          <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center font-serif text-[0.82rem] italic text-muted">
          Staff only. Every session is logged.
        </p>
      </div>
    </div>
  );
}
