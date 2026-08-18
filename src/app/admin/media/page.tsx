"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  MediaGrid,
  UploadDropzone,
  useMediaLibrary,
  type MediaAsset,
} from "@/components/admin/MediaPicker";
import { api } from "@/components/admin/api";
import { AdminLoader, ConfirmButton, useToast } from "@/components/admin/ui";

export default function MediaPage() {
  const { items, loading, cloudinary, error, upload, setItems } = useMediaLibrary();
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const { toast, element } = useToast();

  async function saveMeta(asset: MediaAsset) {
    const data = await api<{ item: MediaAsset }>(`/api/admin/media/${asset._id}`, {
      method: "PUT",
      body: JSON.stringify({ alt: asset.alt, caption: asset.caption, credit: asset.credit }),
    });
    setItems((prev) => prev.map((i) => (i._id === asset._id ? data.item : i)));
    setSelected(null);
    toast("Asset details saved.");
  }

  async function remove(asset: MediaAsset) {
    await api(`/api/admin/media/${asset._id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i._id !== asset._id));
    setSelected(null);
    toast("Asset deleted.");
  }

  return (
    <div>
      {element}
      <header className="mb-8">
        <h1 className="headline text-[1.9rem]">Media Library</h1>
        <p className="mt-1 font-sans text-[0.875rem] text-muted">
          Every image, video, and document — hosted on Cloudinary.
        </p>
      </header>

      {!cloudinary ? (
        <p className="mb-6 border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-[0.85rem] text-amber-800">
          Cloudinary credentials are missing. Add <code>CLOUDINARY_CLOUD_NAME</code>,{" "}
          <code>CLOUDINARY_API_KEY</code>, and <code>CLOUDINARY_API_SECRET</code> to{" "}
          <code>.env.local</code>, then restart the dev server.
        </p>
      ) : (
        <div className="mb-8">
          <UploadDropzone
            onUpload={async (file) => {
              await upload(file);
              toast("Uploaded.");
            }}
          />
        </div>
      )}

      {error ? <p className="mb-4 font-sans text-[0.85rem] text-accent">{error}</p> : null}
      {loading ? <AdminLoader /> : <MediaGrid items={items} onSelect={setSelected} />}

      {selected ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg border border-rule bg-white shadow-2xl animate-in">
            <header className="flex items-center justify-between border-b border-rule px-5 py-3.5">
              <h2 className="font-sans text-[0.85rem] font-semibold uppercase tracking-[0.08em]">
                Asset details
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-1 text-muted hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {selected.resourceType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.url}
                  alt={selected.alt || ""}
                  className="mb-4 max-h-64 w-full border border-rule object-contain"
                />
              ) : null}
              <div className="grid gap-4">
                <label>
                  <span className="admin-label">Alt text</span>
                  <input
                    value={selected.alt || ""}
                    onChange={(e) => setSelected({ ...selected, alt: e.target.value })}
                    className="admin-input"
                  />
                </label>
                <label>
                  <span className="admin-label">Caption</span>
                  <input
                    value={selected.caption || ""}
                    onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                    className="admin-input"
                  />
                </label>
                <label>
                  <span className="admin-label">Credit</span>
                  <input
                    value={selected.credit || ""}
                    onChange={(e) => setSelected({ ...selected, credit: e.target.value })}
                    className="admin-input"
                  />
                </label>
                <p className="break-all font-sans text-[0.72rem] text-muted">{selected.url}</p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-rule pt-4">
                <ConfirmButton onConfirm={() => remove(selected)}>Delete asset</ConfirmButton>
                <button type="button" onClick={() => saveMeta(selected)} className="btn-primary">
                  Save details
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
