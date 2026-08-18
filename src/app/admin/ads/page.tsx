"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { ImageField } from "@/components/admin/MediaPicker";
import { AdminLoader, ConfirmButton, StatusPill, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

type Slot = {
  _id: string;
  key: string;
  name: string;
  placement: string;
  width: number;
  height: number;
  enabled: boolean;
};

type Campaign = {
  _id: string;
  name: string;
  slotKey: string;
  type: "image" | "html";
  imageUrl?: string;
  clickUrl?: string;
  html?: string;
  alt?: string;
  sponsorName?: string;
  startAt?: string | null;
  endAt?: string | null;
  active: boolean;
  impressions: number;
  clicks: number;
  priority: number;
};

const EMPTY: Partial<Campaign> = {
  name: "",
  slotKey: "",
  type: "image",
  imageUrl: "",
  clickUrl: "",
  sponsorName: "",
  active: true,
  priority: 0,
};

export default function AdsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Campaign> | null>(null);
  const [error, setError] = useState("");
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ slots: Slot[]; campaigns: Campaign[] }>("/api/admin/ads")
      .then((d) => {
        setSlots(d.slots);
        setCampaigns(d.campaigns);
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggleSlot(slot: Slot) {
    const d = await api<{ item: Slot }>(`/api/admin/ads/${slot._id}`, {
      method: "PUT",
      body: JSON.stringify({ kind: "slot", enabled: !slot.enabled }),
    });
    setSlots((prev) => prev.map((s) => (s._id === slot._id ? d.item : s)));
    toast(d.item.enabled ? "Slot enabled." : "Slot disabled.");
  }

  async function saveCampaign() {
    if (!editing?.name || !editing.slotKey) {
      setError("Give the campaign a name and a slot.");
      return;
    }
    setError("");
    const payload = {
      ...editing,
      startAt: editing.startAt || null,
      endAt: editing.endAt || null,
    };
    try {
      if (editing._id) {
        const d = await api<{ item: Campaign }>(`/api/admin/ads/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCampaigns((prev) => prev.map((c) => (c._id === d.item._id ? d.item : c)));
      } else {
        const d = await api<{ item: Campaign }>("/api/admin/ads", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCampaigns((prev) => [d.item, ...prev]);
      }
      setEditing(null);
      toast("Campaign saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    }
  }

  async function removeCampaign(id: string) {
    await api(`/api/admin/ads/${id}`, { method: "DELETE" });
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
    toast("Campaign deleted.");
  }

  if (loading) return <AdminLoader />;

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Advertising</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            Fixed inventory, sold directly. Empty slots show the house ad.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY, slotKey: slots[0]?.key || "" })}
          className="btn-primary"
        >
          New campaign
        </button>
      </header>

      <section className="mb-10">
        <h2 className="section-title mb-4">Inventory</h2>
        <div className="overflow-x-auto border border-rule bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule bg-paper-2/60">
                {["Slot", "Placement", "Format", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {slots.map((slot) => (
                <tr key={slot._id}>
                  <td className="px-4 py-3.5">
                    <p className="font-sans text-[0.875rem] font-medium">{slot.name}</p>
                    <p className="font-mono text-[0.7rem] text-muted">{slot.key}</p>
                  </td>
                  <td className="px-4 py-3.5 font-sans text-[0.82rem] text-ink-soft">
                    {slot.placement}
                  </td>
                  <td className="px-4 py-3.5 font-sans text-[0.82rem] tabular-nums text-muted">
                    {slot.width} × {slot.height}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={slot.enabled ? "active" : "archived"} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className="font-sans text-[0.78rem] font-medium text-ink-soft hover:text-ink"
                    >
                      {slot.enabled ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">Campaigns</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => (
            <div key={c._id} className="border border-rule bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-sans text-[0.95rem] font-semibold">{c.name}</h3>
                  <p className="mt-0.5 font-mono text-[0.7rem] text-muted">{c.slotKey}</p>
                </div>
                <StatusPill status={c.active ? "active" : "archived"} />
              </div>
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.imageUrl}
                  alt=""
                  className="mt-3 max-h-28 w-full border border-rule object-contain"
                />
              ) : null}
              <p className="mt-3 font-sans text-[0.78rem] tabular-nums text-muted">
                {c.impressions.toLocaleString()} impressions · {c.clicks.toLocaleString()} clicks
                {c.impressions > 0 ? ` · ${((c.clicks / c.impressions) * 100).toFixed(1)}% CTR` : ""}
              </p>
              <div className="mt-4 flex items-center gap-4 border-t border-rule pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...c,
                      startAt: c.startAt ? String(c.startAt).slice(0, 10) : "",
                      endAt: c.endAt ? String(c.endAt).slice(0, 10) : "",
                    })
                  }
                  className="font-sans text-[0.8rem] font-medium text-ink-soft hover:text-ink"
                >
                  Edit
                </button>
                <ConfirmButton onConfirm={() => removeCampaign(c._id)}>Delete</ConfirmButton>
              </div>
            </div>
          ))}
          {campaigns.length === 0 ? (
            <p className="col-span-full border border-dashed border-rule bg-white px-6 py-12 text-center font-sans text-[0.875rem] text-muted">
              No campaigns yet. Slots without a campaign show the &ldquo;Advertise with
              PrimeCrest&rdquo; house ad.
            </p>
          ) : null}
        </div>
      </section>

      {editing ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setEditing(null)} />
          <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto border border-rule bg-white p-6 shadow-2xl animate-in">
            <h2 className="headline mb-5 text-[1.4rem]">
              {editing._id ? "Edit campaign" : "New campaign"}
            </h2>
            <div className="grid gap-4">
              <label>
                <span className="admin-label">Campaign name</span>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="admin-input"
                  autoFocus
                />
              </label>
              <label>
                <span className="admin-label">Sponsor</span>
                <input
                  value={editing.sponsorName || ""}
                  onChange={(e) => setEditing({ ...editing, sponsorName: e.target.value })}
                  className="admin-input"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="admin-label">Slot</span>
                  <select
                    value={editing.slotKey || ""}
                    onChange={(e) => setEditing({ ...editing, slotKey: e.target.value })}
                    className="admin-input"
                  >
                    {slots.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="admin-label">Type</span>
                  <select
                    value={editing.type || "image"}
                    onChange={(e) =>
                      setEditing({ ...editing, type: e.target.value as "image" | "html" })
                    }
                    className="admin-input"
                  >
                    <option value="image">Image creative</option>
                    <option value="html">Custom HTML</option>
                  </select>
                </label>
              </div>

              {editing.type === "html" ? (
                <label>
                  <span className="admin-label">HTML</span>
                  <textarea
                    value={editing.html || ""}
                    onChange={(e) => setEditing({ ...editing, html: e.target.value })}
                    rows={5}
                    className="admin-input resize-y font-mono text-[0.78rem]"
                  />
                </label>
              ) : (
                <>
                  <ImageField
                    label="Creative"
                    value={editing.imageUrl || ""}
                    onChange={(url) => setEditing({ ...editing, imageUrl: url })}
                  />
                  <label>
                    <span className="admin-label">Click-through URL</span>
                    <input
                      value={editing.clickUrl || ""}
                      onChange={(e) => setEditing({ ...editing, clickUrl: e.target.value })}
                      placeholder="https://"
                      className="admin-input"
                    />
                  </label>
                  <label>
                    <span className="admin-label">Alt text</span>
                    <input
                      value={editing.alt || ""}
                      onChange={(e) => setEditing({ ...editing, alt: e.target.value })}
                      className="admin-input"
                    />
                  </label>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="admin-label">Starts</span>
                  <input
                    type="date"
                    value={(editing.startAt as string) || ""}
                    onChange={(e) => setEditing({ ...editing, startAt: e.target.value })}
                    className="admin-input"
                  />
                </label>
                <label>
                  <span className="admin-label">Ends</span>
                  <input
                    type="date"
                    value={(editing.endAt as string) || ""}
                    onChange={(e) => setEditing({ ...editing, endAt: e.target.value })}
                    className="admin-input"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="admin-label">Priority</span>
                  <input
                    type="number"
                    value={editing.priority ?? 0}
                    onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) })}
                    className="admin-input"
                  />
                </label>
                <div className="flex items-end pb-1">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, active: !editing.active })}
                    className={cn(
                      "w-full border px-3 py-2 font-sans text-[0.8rem] font-medium transition-colors",
                      editing.active
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-rule bg-paper-2 text-muted",
                    )}
                  >
                    {editing.active ? "Active" : "Paused"}
                  </button>
                </div>
              </div>
            </div>
            {error ? <p className="mt-3 font-sans text-[0.8rem] text-accent">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">
                Cancel
              </button>
              <button type="button" onClick={saveCampaign} className="btn-primary">
                Save campaign
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
