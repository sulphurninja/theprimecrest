import mongoose, { Schema } from "mongoose";

const ContributorSchema = new Schema(
  {
    role: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const GallerySchema = new Schema(
  {
    url: String,
    alt: String,
    caption: String,
    credit: String,
  },
  { _id: false },
);

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    dek: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    coverCaption: { type: String, default: "" },
    coverCredit: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: { type: [ContributorSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    featured: { type: Boolean, default: false },
    featuredRank: { type: Number, default: 0 },
    isCoverStory: { type: Boolean, default: false },
    isHero: { type: Boolean, default: false },
    format: {
      type: String,
      enum: ["feature", "standard", "brief", "interview", "essay", "photo"],
      default: "standard",
    },
    allowAds: { type: Boolean, default: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    canonical: { type: String, default: "" },
    noIndex: { type: Boolean, default: false },
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    gallery: { type: [GallerySchema], default: [] },
    pullQuote: {
      text: { type: String, default: "" },
      attribution: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

ArticleSchema.index({ title: "text", dek: "text", excerpt: "text", content: "text" });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1, status: 1, publishedAt: -1 });

export type ArticleDoc = mongoose.InferSchemaType<typeof ArticleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Article =
  (mongoose.models.Article as mongoose.Model<ArticleDoc>) ||
  mongoose.model<ArticleDoc>("Article", ArticleSchema);
