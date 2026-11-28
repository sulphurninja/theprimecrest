import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    kicker: { type: String, default: "" },
    description: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
    magazines: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    // Show the "On the magazine stand" cover shelf on this section's page.
    // Off: magazine features list as ordinary story cards.
    showMagazineShelf: { type: Boolean, default: true },
    // Stories pinned to the top of the section, in display order.
    pinnedArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true },
);

export type CategoryDoc = mongoose.InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Category =
  (mongoose.models.Category as mongoose.Model<CategoryDoc>) ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);
