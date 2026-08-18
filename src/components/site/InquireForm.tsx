"use client";

import { useState } from "react";

export function InquireForm({
  type = "contact",
}: {
  type?: "contact" | "advertise" | "editorial";
}) {
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("busy");
    const el = e.currentTarget;
    const form = new FormData(el);
    try {
      const res = await fetch("/api/public/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          budget: form.get("budget"),
          message: form.get("message"),
        }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) el.reset();
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-rule bg-paper-2 px-8 py-10 text-center">
        <p className="headline text-[1.5rem]">Thank you. We have it.</p>
        <p className="mt-3 font-serif text-[0.98rem] text-ink-soft">
          Your note has reached the desk. Someone will reply within two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="admin-label">Full name</span>
          <input name="name" required autoComplete="name" className="admin-input" />
        </label>
        <label>
          <span className="admin-label">Email</span>
          <input name="email" type="email" required autoComplete="email" className="admin-input" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="admin-label">Organisation (optional)</span>
          <input name="company" autoComplete="organization" className="admin-input" />
        </label>
        {type === "advertise" ? (
          <label>
            <span className="admin-label">Indicative budget</span>
            <select name="budget" className="admin-input">
              <option value="">Prefer not to say</option>
              <option>Under $10,000</option>
              <option>$10,000 – $25,000</option>
              <option>$25,000 – $75,000</option>
              <option>$75,000+</option>
            </select>
          </label>
        ) : null}
      </div>
      <label>
        <span className="admin-label">Message</span>
        <textarea name="message" required rows={6} className="admin-input resize-y" />
      </label>
      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === "busy"} className="btn-primary disabled:opacity-60">
          {status === "busy" ? "Sending…" : "Send message"}
        </button>
        {status === "err" ? (
          <p className="font-sans text-[0.85rem] text-accent">Something failed. Please try again.</p>
        ) : null}
      </div>
    </form>
  );
}
