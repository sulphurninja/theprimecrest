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
          <span className="label mb-2 block text-muted">
            Name
          </span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="input"
          />
        </label>
        <label>
          <span className="label mb-2 block text-muted">
            Email
          </span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="input"
          />
        </label>
      </div>
      <label>
        <span className="label mb-2 block text-muted">
          Subject
        </span>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="What is this regarding?"
          className="input"
        />
      </label>
      <label>
        <span className="label mb-2 block text-muted">
          Message
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Write your message here…"
          className="input resize-none"
        />
      </label>

      {status === "error" ? (
        <p className="font-sans text-[0.82rem] text-accent">
          Something went wrong. Please try again.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
