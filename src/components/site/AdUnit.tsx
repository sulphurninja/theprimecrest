"use client";

import Link from "next/link";
import { useEffect } from "react";

type Campaign = {
  _id: string;
  type: "image" | "html";
  imageUrl?: string;
  clickUrl?: string;
  html?: string;
  alt?: string;
  sponsorName?: string;
} | null;

function track(id: string, kind: "impression" | "click") {
  // Local demo creatives have no database record to count against.
  if (id.startsWith("demo-")) return;
  fetch(`/api/ads/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind }),
    keepalive: true,
  }).catch(() => {});
}

export function AdUnit({
  slot,
  campaign,
  className = "",
}: {
  slot: { key: string; name: string; width: number; height: number };
  campaign: Campaign;
  className?: string;
}) {
  useEffect(() => {
    if (campaign?._id) track(campaign._id, "impression");
  }, [campaign?._id]);

  const label = (
    <p className="mb-2 text-center font-sans text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted">
      Advertisement
    </p>
  );

  /* Reserved, unsold inventory — a quiet house ad. */
  if (!campaign) {
    return (
      <aside className={className} aria-label="Advertisement placeholder">
        {label}
        <Link
          href="/advertise"
          className="group flex flex-col items-center justify-center gap-2 border border-ink/20 bg-surface px-6 py-9 text-center no-underline transition-colors hover:border-ink"
          style={{ minHeight: Math.min(slot.height, 250) }}
        >
          <span className="display-caps text-[1.4rem] text-ink">Advertise with PrimeCrest</span>
          <span className="read-more text-ink">Reach decision-makers »</span>
        </Link>
      </aside>
    );
  }

  if (campaign.type === "html" && campaign.html) {
    return (
      <aside className={className} aria-label="Advertisement">
        {label}
        {/* Third-party HTML can carry fixed widths; keep it from widening the page. */}
        <div className="overflow-hidden border border-rule" dangerouslySetInnerHTML={{ __html: campaign.html }} />
      </aside>
    );
  }

  return (
    <aside className={className} aria-label="Advertisement">
      {label}
      <a
        href={campaign.clickUrl || "/advertise"}
        target="_blank"
        rel="noopener sponsored"
        onClick={() => track(campaign._id, "click")}
        className="block border border-rule bg-ad-bg"
      >
        {campaign.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.imageUrl}
            alt={campaign.alt || campaign.sponsorName || "Advertisement"}
            className="mx-auto block max-h-[600px] w-full object-contain"
          />
        ) : (
          <div className="flex min-h-[90px] items-center justify-center">
            <span className="headline text-lg">{campaign.sponsorName || "Advertisement"}</span>
          </div>
        )}
      </a>
      {campaign.sponsorName ? (
        <p className="mt-1.5 text-center font-sans text-[0.68rem] text-muted">
          Sponsored by {campaign.sponsorName}
        </p>
      ) : null}
    </aside>
  );
}
