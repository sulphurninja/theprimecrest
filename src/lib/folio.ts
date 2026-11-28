import mongoose, { Schema } from "mongoose";
import { dbConnect } from "@/lib/db";
import { MAGAZINE_DOMAIN } from "@/lib/magazines";

/**
 * The folio flipbook app (magazines.theprimecrest.com) keeps its issues in its
 * own database on the same MongoDB cluster. Editorial writes image issues there
 * so a PDF uploaded on a story becomes a flipbook at /m/<slug>.
 *
 * This schema mirrors folio's src/models/Magazine.ts. Keep the two in step.
 */
const PageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    caption: { type: String, default: "" },
  },
  { _id: true },
);

const FolioMagazineSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    issueLabel: { type: String, default: "" },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    pages: { type: [PageSchema], default: [] },
    kind: { type: String, enum: ["images", "html"], default: "images" },
    pagesHtml: { type: [String], default: [] },
    toc: { type: [{ page: Number, label: String, _id: false }], default: [] },
    ogImage: { type: String, default: "" },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "magazines" },
);

export type FlipbookPage = { url: string; publicId: string; width: number; height: number };

export async function folioMagazines() {
  const conn = await dbConnect();
  const db = conn.useDb(process.env.FOLIO_DB || "folio", { useCache: true });
  return (db.models.Magazine as mongoose.Model<mongoose.InferSchemaType<typeof FolioMagazineSchema>>) ||
    db.model("Magazine", FolioMagazineSchema);
}

/** Cloudinary folder for a flipbook's page images. */
export function flipbookFolder(slug: string) {
  return `${process.env.FOLIO_CLOUDINARY_FOLDER || "folio"}/${slug}`;
}

export function flipbookUrl(slug: string) {
  return `${MAGAZINE_DOMAIN}/m/${slug}`;
}

/**
 * Hand-built issues live as static routes in folio (/m/erica, /m/verna ...),
 * which win over database issues. Flipbook slugs must not use these names.
 */
export const RESERVED_FOLIO_SLUGS = new Set([
  "bethany", "bhatia", "erica", "espey", "foskaris", "geeta", "joan", "joneric", "judy", "katie",
  "kohila", "liutciia", "nichole", "november", "pallavi", "saj", "sergey", "verna", "vineet", "fonts",
]);
