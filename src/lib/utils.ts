import slugifyLib from "slugify";

export function slugify(value: string) {
  return slugifyLib(value, { lower: true, strict: true, trim: true });
}

export function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(value?: string | Date | null, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  });
}

export function formatMastheadDate(value = new Date()) {
  return value.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Converts Mongoose documents (ObjectIds, Dates) into plain JSON for the
 * React boundary. The generic reflects the serialized shape, not the input.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<T = any>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function excerptFromHtml(html: string, length = 180) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** "12m ago", "3h ago", "2d ago" — falls back to a date after a week. */
export function timeAgo(value?: string | Date | null, now = Date.now()) {
  if (!value) return "";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.round((now - then) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value, { day: "numeric", month: "short", year: undefined });
}
