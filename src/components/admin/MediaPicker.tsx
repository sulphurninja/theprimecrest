"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { api } from "@/components/admin/api";
import { AdminLoader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export type MediaAsset = {
  _id: string;
  url: string;
  resourceType: string;
  alt?: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt?: string;
};

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloudinary, setCloudinary] = useState(true);
  const [error, setError] = useState("");

  // `loading` starts true; later refreshes keep stale items visible instead
  // of flashing a spinner, so no synchronous setLoading(true) here.
  const refresh = useCallback(async () => {
    try {
      const data = await api<{ items: MediaAsset[]; cloudinary: boolean }>("/api/admin/media");
      setItems(data.items);
      setCloudinary(data.cloudinary);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: refresh() only sets state after its awaits resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File, meta?: { alt?: string; credit?: string }) => {
      const form = new FormData();
      form.append("file", file);
      if (meta?.alt) form.append("alt", meta.alt);
      if (meta?.credit) form.append("credit", meta.credit);
      const data = await api<{ item: MediaAsset }>("/api/admin/media", {
        method: "POST",
        body: form,
      });
      setItems((prev) => [data.item, ...prev]);
      return data.item;
    },
    [],
  );

  return { items, loading, cloudinary, error, refresh, upload, setItems };
}

export function UploadDropzone({
  onUpload,
  disabled,
}: {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length || busy) return;
    setBusy(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        await onUpload(file);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-9 transition-colors",
          drag ? "border-ink bg-paper-2" : "border-rule bg-white hover:border-ink",
          (disabled || busy) && "opacity-60",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted" strokeWidth={1.6} />
        <span className="font-sans text-[0.85rem] font-medium">
          {busy ? "Uploading…" : "Drop files here or click to upload"}
        </span>
        <span className="font-sans text-[0.72rem] text-muted">
          Images, video, and audio — stored on Cloudinary
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,application/pdf"
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? <p className="mt-2 font-sans text-[0.8rem] text-accent">{error}</p> : null}
    </div>
  );
}

export function MediaGrid({
  items,
  onSelect,
  selectedUrl,
}: {
  items: MediaAsset[];
  onSelect?: (asset: MediaAsset) => void;
  selectedUrl?: string;
}) {
  if (!items.length) {
    return (
      <p className="py-12 text-center font-sans text-[0.85rem] text-muted">
        The library is empty. Upload the first asset above.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((asset) => (
        <button
          key={asset._id}
          type="button"
          onClick={() => onSelect?.(asset)}
          className={cn(
            "group relative aspect-square overflow-hidden border bg-paper-2 text-left transition-all",
            selectedUrl === asset.url
              ? "border-ink ring-2 ring-ink"
              : "border-rule hover:border-ink",
          )}
        >
          {asset.resourceType === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.url}
              alt={asset.alt || ""}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-3 text-center font-sans text-[0.72rem] uppercase tracking-wide text-muted">
              {asset.resourceType} · {asset.format}
            </div>
          )}
          {asset.alt ? (
            <span className="absolute inset-x-0 bottom-0 truncate bg-ink/70 px-2 py-1 font-sans text-[0.68rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {asset.alt}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function MediaPickerDialog({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
}) {
  const { items, loading, cloudinary, upload } = useMediaLibrary();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col border border-rule bg-white shadow-2xl animate-in">
        <header className="flex items-center justify-between border-b border-rule px-5 py-3.5">
          <h2 className="font-sans text-[0.85rem] font-semibold uppercase tracking-[0.08em]">
            Media Library
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          {!cloudinary ? (
            <p className="mb-4 border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-[0.8rem] text-amber-800">
              Cloudinary isn&apos;t configured. Add credentials to <code>.env.local</code> to
              enable uploads. Existing assets remain usable.
            </p>
          ) : (
            <div className="mb-5">
              <UploadDropzone
                onUpload={async (file) => {
                  const asset = await upload(file);
                  onSelect(asset);
                }}
              />
            </div>
          )}
          {loading ? <AdminLoader /> : <MediaGrid items={items} onSelect={onSelect} />}
        </div>
      </div>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <span className="admin-label">{label}</span>
      {value ? (
        <div className="relative mb-2 border border-rule bg-paper-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="max-h-44 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-full bg-ink/80 p-1.5 text-white hover:bg-accent"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(true)} className="btn-outline !px-4 !py-2 text-[0.75rem]">
          {value ? "Replace" : "Choose from library"}
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className="admin-input flex-1"
        />
      </div>
      {open ? (
        <MediaPickerDialog
          onClose={() => setOpen(false)}
          onSelect={(asset) => {
            onChange(asset.url);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
