"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AdminCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-rule bg-white", className)}>
      {title ? (
        <header className="flex items-center justify-between border-b border-rule px-5 py-3.5">
          <h2 className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.08em]">
            {title}
          </h2>
          {action}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border-amber-200",
    scheduled: "bg-sky-50 text-sky-700 border-sky-200",
    archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    new: "bg-sky-50 text-sky-700 border-sky-200",
    read: "bg-neutral-100 text-neutral-500 border-neutral-200",
    replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 font-sans text-[0.7rem] font-medium capitalize",
        styles[status] || "bg-neutral-100 text-neutral-600 border-neutral-200",
      )}
    >
      {status}
    </span>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 border border-ink bg-ink px-5 py-3 font-sans text-[0.85rem] text-white shadow-lg animate-in">
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  return {
    toast: (m: string) => setMessage(m),
    element: message ? <Toast message={message} onDone={() => setMessage(null)} /> : null,
  };
}

export function AdminLoader() {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="relative h-px w-20 overflow-hidden rounded-full bg-rule">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-loader-slide rounded-full bg-ink" />
      </div>
    </div>
  );
}

export function ConfirmButton({
  onConfirm,
  children,
  className = "",
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 2500);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      className={cn(
        "font-sans text-[0.78rem] font-medium transition-colors",
        armed ? "text-accent" : "text-muted hover:text-ink",
        className,
      )}
    >
      {armed ? "Confirm?" : children}
    </button>
  );
}
