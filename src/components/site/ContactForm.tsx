"use client";

import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-rule bg-paper-2 px-6 py-10 text-center">
        <p className="headline text-[1.4rem]">Thank you.</p>
        <p className="mt-2 font-serif text-[0.95rem] text-ink-soft">
          Your message has been received. We&apos;ll be in touch if a response is needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block font-sans text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
            Name
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full border border-rule bg-white px-4 py-3 font-sans text-[0.9rem] text-ink outline-none transition-colors focus:border-ink"
          />
        </label>
        <label>
          <span className="mb-1.5 block font-sans text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
            Email
          </span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full border border-rule bg-white px-4 py-3 font-sans text-[0.9rem] text-ink outline-none transition-colors focus:border-ink"
          />
        </label>
      </div>
      <label>
        <span className="mb-1.5 block font-sans text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
          Subject
        </span>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="What is this regarding?"
          className="w-full border border-rule bg-white px-4 py-3 font-sans text-[0.9rem] text-ink outline-none transition-colors focus:border-ink"
        />
      </label>
      <label>
        <span className="mb-1.5 block font-sans text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Write your message here…"
          className="w-full resize-none border border-rule bg-white px-4 py-3 font-sans text-[0.9rem] text-ink outline-none transition-colors focus:border-ink"
        />
      </label>

      {status === "error" ? (
        <p className="font-sans text-[0.82rem] text-red-600">
          Something went wrong. Please try again.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center border border-ink bg-ink px-7 py-3 font-sans text-[0.82rem] font-semibold text-paper transition-all hover:bg-transparent hover:text-ink disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
