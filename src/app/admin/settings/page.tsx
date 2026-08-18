"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { AdminLoader, useToast } from "@/components/admin/ui";

type Settings = {
  siteName: string;
  tagline: string;
  description: string;
  issueLabel: string;
  ticker: string;
  contactEmail: string;
  advertiseEmail: string;
  footerBlurb: string;
  copyright: string;
  socials: {
    twitter: string;
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
  };
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast, element } = useToast();

  useEffect(() => {
    api<{ settings: Settings }>("/api/admin/settings").then((d) => setSettings(d.settings));
  }, []);

  async function save() {
    if (!settings) return;
    setBusy(true);
    try {
      await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) });
      toast("Settings saved.");
    } finally {
      setBusy(false);
    }
  }

  if (!settings) return <AdminLoader />;

  const set = (patch: Partial<Settings>) => setSettings({ ...settings, ...patch });

  return (
    <div>
      {element}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="headline text-[1.9rem]">Settings</h1>
          <p className="mt-1 font-sans text-[0.875rem] text-muted">
            The identity and plumbing of the journal.
          </p>
        </div>
        <button type="button" onClick={save} disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Saving…" : "Save settings"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 border border-rule bg-white p-6">
          <h2 className="section-title">Identity</h2>
          <label>
            <span className="admin-label">Publication name</span>
            <input
              value={settings.siteName}
              onChange={(e) => set({ siteName: e.target.value })}
              className="admin-input"
            />
          </label>
          <label>
            <span className="admin-label">Tagline</span>
            <input
              value={settings.tagline}
              onChange={(e) => set({ tagline: e.target.value })}
              className="admin-input"
            />
          </label>
          <label>
            <span className="admin-label">Description (SEO)</span>
            <textarea
              value={settings.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={3}
              className="admin-input resize-none"
            />
          </label>
          <label>
            <span className="admin-label">Breaking ticker (leave empty to hide)</span>
            <input
              value={settings.ticker}
              onChange={(e) => set({ ticker: e.target.value })}
              placeholder="A short line pinned above the masthead"
              className="admin-input"
            />
          </label>
        </section>

        <section className="space-y-4 border border-rule bg-white p-6">
          <h2 className="section-title">Contact & footer</h2>
          <label>
            <span className="admin-label">Editorial email</span>
            <input
              value={settings.contactEmail}
              onChange={(e) => set({ contactEmail: e.target.value })}
              className="admin-input"
            />
          </label>
          <label>
            <span className="admin-label">Advertising email</span>
            <input
              value={settings.advertiseEmail}
              onChange={(e) => set({ advertiseEmail: e.target.value })}
              className="admin-input"
            />
          </label>
          <label>
            <span className="admin-label">Footer blurb</span>
            <textarea
              value={settings.footerBlurb}
              onChange={(e) => set({ footerBlurb: e.target.value })}
              rows={3}
              className="admin-input resize-none"
            />
          </label>
          <label>
            <span className="admin-label">Copyright holder</span>
            <input
              value={settings.copyright}
              onChange={(e) => set({ copyright: e.target.value })}
              className="admin-input"
            />
          </label>
        </section>

        <section className="space-y-4 border border-rule bg-white p-6 lg:col-span-2">
          <h2 className="section-title">Social profiles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(["twitter", "instagram", "linkedin", "facebook", "youtube"] as const).map((key) => (
              <label key={key}>
                <span className="admin-label capitalize">{key}</span>
                <input
                  value={settings.socials?.[key] || ""}
                  onChange={(e) =>
                    set({ socials: { ...settings.socials, [key]: e.target.value } })
                  }
                  placeholder="https://"
                  className="admin-input"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
