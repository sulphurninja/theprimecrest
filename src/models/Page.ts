import mongoose, { Schema } from "mongoose";

const PageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type PageDoc = mongoose.InferSchemaType<typeof PageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page =
  (mongoose.models.Page as mongoose.Model<PageDoc>) || mongoose.model<PageDoc>("Page", PageSchema);
