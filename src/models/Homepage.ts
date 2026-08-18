import mongoose, { Schema } from "mongoose";

const HomepageSchema = new Schema(
  {
    heroArticle: { type: Schema.Types.ObjectId, ref: "Article", default: null },
    featuredArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    coverStory: { type: Schema.Types.ObjectId, ref: "Article", default: null },
    briefingArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    interviewArticle: { type: Schema.Types.ObjectId, ref: "Article", default: null },
    categoryRails: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    showAds: { type: Boolean, default: true },
    showNewsletter: { type: Boolean, default: true },
    showAdvertiseBand: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type HomepageDoc = mongoose.InferSchemaType<typeof HomepageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Homepage =
  (mongoose.models.Homepage as mongoose.Model<HomepageDoc>) ||
  mongoose.model<HomepageDoc>("Homepage", HomepageSchema);
