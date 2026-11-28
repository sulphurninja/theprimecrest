"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/components/admin/api";
import { slugify } from "@/lib/utils";

type Page = { url: string; publicId: string; width: number; height: number };
type Existing = { url: string; pages: number; updatedAt?: string } | null;

/** Long edge of each rendered page, in pixels. Enough for zoom in the reader. */
const PAGE_WIDTH = 2200;
const PARALLEL_UPLOADS = 3;

/**
 * Upload a PDF and turn it into a flipbook on magazines.theprimecrest.com.
 * Pages are rendered in the browser with pdf.js (so the server needs no PDF
 * tools and large files are fine), uploaded one by one, then published to
 * folio as an image issue at /m/<story slug>.
 */
export function PdfFlipbookField({
  slug,
  title,
  issueLabel,
  description,
  onPublished,
}: {
  slug: string;
  title: string;
  issueLabel?: string;
  description?: string;
  onPublished: (result: { url: string; cover: string }) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [existing, setExisting] = useState<Existing>(null);
  const finalSlug = slug || slugify(title);

  useEffect(() => {
    if (!finalSlug) return;
    api<{ flipbook: Existing }>(`/api/admin/flipbook?slug=${encodeURIComponent(finalSlug)}`)
      .then((d) => setExisting(d.flipbook))
      .catch(() => setExisting(null));
  }, [finalSlug]);

  async function build(file: File) {
    if (!finalSlug || !title) {
      setError("Add the story title first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      setStatus("Reading the PDF…");
      const pdfjs = await import("pdfjs-dist");
      // Served from /public; keep it the same version as the pdfjs-dist package.
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const total = doc.numPages;
      const pages: Page[] = new Array(total);
      let done = 0;

      const renderPage = async (index: number) => {
        const page = await doc.getPage(index + 1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: PAGE_WIDTH / base.width });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("This browser cannot render the PDF.");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not encode a page."))), "image/jpeg", 0.88),
        );
        page.cleanup();
        canvas.width = 0;
        canvas.height = 0;

        const form = new FormData();
        form.append("file", new File([blob], `page-${index + 1}.jpg`, { type: "image/jpeg" }));
        form.append("slug", finalSlug);
        form.append("index", String(index));
        const res = await api<{ page: Page }>("/api/admin/flipbook/page", { method: "POST", body: form });
        pages[index] = res.page;
        done += 1;
        setStatus(`Rendering and uploading pages… ${done} of ${total}`);
      };

      setStatus(`Rendering and uploading pages… 0 of ${total}`);
      let next = 0;
      const worker = async () => {
        while (next < total) {
          const index = next++;
          await renderPage(index);
        }
      };
      await Promise.all(Array.from({ length: Math.min(PARALLEL_UPLOADS, total) }, worker));
      await doc.destroy();

      setStatus("Publishing the flipbook…");
      const result = await api<{ url: string; cover: string; pages: number }>("/api/admin/flipbook", {
        method: "POST",
        body: JSON.stringify({ slug: finalSlug, title, issueLabel, description, pages }),
      });
      setExisting({ url: result.url, pages: result.pages });
      onPublished({ url: result.url, cover: result.cover });
      setStatus(`Flipbook published, ${result.pages} pages. Save the story to keep the link.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the flipbook.");
      setStatus("");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="border border-rule bg-paper-2 p-3">
      <span className="admin-label">Flipbook from PDF</span>
      <p className="mb-2 font-sans text-[0.72rem] leading-snug text-muted">
        Upload the edition&apos;s PDF. Each page becomes a page of the flipbook at{" "}
        <span className="font-medium text-ink">magazines.theprimecrest.com/m/{finalSlug || "…"}</span>, and the
        magazine link below is filled in. Uploading again replaces the pages.
      </p>
      {existing ? (
        <p className="mb-2 font-sans text-[0.75rem] text-ink">
          Current flipbook: {existing.pages} pages ·{" "}
          <a href={existing.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            Open
          </a>
        </p>
      ) : null}
      <input
        ref={input}
        type="file"
        accept="application/pdf"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void build(file);
        }}
        className="block w-full font-sans text-[0.8rem] file:mr-3 file:border file:border-ink file:bg-white file:px-3 file:py-1.5 file:font-sans file:text-[0.78rem] file:font-semibold disabled:opacity-60"
      />
      {status ? <p className="mt-2 font-sans text-[0.75rem] text-ink">{status}</p> : null}
      {error ? <p className="mt-2 font-sans text-[0.75rem] text-red-700">{error}</p> : null}
    </div>
  );
}
