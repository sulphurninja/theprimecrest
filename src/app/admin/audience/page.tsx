"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { AdminLoader, StatusPill, useToast } from "@/components/admin/ui";
import { formatDate, cn } from "@/lib/utils";

type Inquiry = {
  _id: string;
  type: string;
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  status: string;
  createdAt: string;
};

type Subscriber = {
  _id: string;
  email: string;
  status: string;
  createdAt: string;
};

export default function AudiencePage() {
  const [tab, setTab] = useState<"inquiries" | "subscribers">("inquiries");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const { toast, element } = useToast();

  useEffect(() => {
    Promise.all([
      api<{ items: Inquiry[] }>("/api/admin/audience?kind=inquiries"),
      api<{ items: Subscriber[] }>("/api/admin/audience?kind=subscribers"),
    ])
      .then(([inq, subs]) => {
        setInquiries(inq.items);
        setSubscribers(subs.items);
      })
      .finally(() => setLoading(false));
  }, []);

  async function setStatus(id: string, status: string) {
    const d = await api<{ item: Inquiry }>(`/api/admin/audience/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    setInquiries((prev) => prev.map((i) => (i._id === id ? d.item : i)));
    toast("Updated.");
  }

  if (loading) return <AdminLoader />;

  return (
    <div>
      {element}
      <header className="mb-8">
        <h1 className="headline text-[1.9rem]">Audience</h1>
        <p className="mt-1 font-sans text-[0.875rem] text-muted">
          Inbound inquiries and the newsletter list.
        </p>
      </header>

      <div className="mb-6 flex overflow-hidden rounded border border-rule bg-white">
        {(
          [
            ["inquiries", `Inquiries (${inquiries.length})`],
            ["subscribers", `Subscribers (${subscribers.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "px-5 py-2.5 font-sans text-[0.85rem] transition-colors",
              tab === key ? "bg-ink font-medium text-white" : "text-ink-soft hover:bg-paper-2",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "inquiries" ? (
        <div className="border border-rule bg-white">
          <ul className="divide-y divide-rule">
            {inquiries.map((inq) => (
              <li key={inq._id}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(openId === inq._id ? null : inq._id);
                    if (inq.status === "new") setStatus(inq._id, "read");
                  }}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-2"
                >
                  <div className="min-w-0">
                    <p className="font-sans text-[0.9rem] font-medium">
                      {inq.name}
                      <span className="font-normal text-muted"> · {inq.email}</span>
                    </p>
                    <p className="mt-0.5 truncate font-serif text-[0.88rem] text-ink-soft">
                      {inq.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-sans text-[0.72rem] uppercase tracking-wide text-muted">
                      {inq.type}
                    </span>
                    <StatusPill status={inq.status} />
                  </div>
                </button>
                {openId === inq._id ? (
                  <div className="border-t border-rule bg-paper-2/50 px-5 py-4">
                    <p className="whitespace-pre-wrap font-serif text-[0.95rem] leading-relaxed">
                      {inq.message}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 font-sans text-[0.78rem] text-muted">
                      {inq.company ? <span>Company: {inq.company}</span> : null}
                      {inq.budget ? <span>Budget: {inq.budget}</span> : null}
                      <span>{formatDate(inq.createdAt)}</span>
                      <a href={`mailto:${inq.email}`} className="text-accent no-underline">
                        Reply by email →
                      </a>
                      <button
                        type="button"
                        onClick={() => setStatus(inq._id, "replied")}
                        className="text-ink-soft hover:text-ink"
                      >
                        Mark replied
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
            {inquiries.length === 0 ? (
              <li className="px-5 py-14 text-center font-sans text-[0.875rem] text-muted">
                No inquiries yet.
              </li>
            ) : null}
          </ul>
        </div>
      ) : (
        <div className="border border-rule bg-white">
          <ul className="divide-y divide-rule">
            {subscribers.map((sub) => (
              <li key={sub._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <p className="font-sans text-[0.9rem]">{sub.email}</p>
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[0.75rem] text-muted">
                    {formatDate(sub.createdAt)}
                  </span>
                  <StatusPill status={sub.status} />
                </div>
              </li>
            ))}
            {subscribers.length === 0 ? (
              <li className="px-5 py-14 text-center font-sans text-[0.875rem] text-muted">
                No subscribers yet.
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}
