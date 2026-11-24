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
    // Stories pinned to each section row, keyed by category id, in display order.
    railArticles: { type: Map, of: [{ type: Schema.Types.ObjectId, ref: "Article" }], default: {} },
    // Magazine features for "Leaders in Focus", in display order.
    leaderArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    // Stories pinned to "More from PrimeCrest", in display order.
    moreArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    // Article slugs of magazine issues in display order; the first is featured.
    magazineOrder: { type: [String], default: [] },
  },
  { timestamps: true },
);

export type HomepageDoc = mongoose.InferSchemaType<typeof HomepageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Homepage =
  (mongoose.models.Homepage as mongoose.Model<HomepageDoc>) ||
  mongoose.model<HomepageDoc>("Homepage", HomepageSchema);
