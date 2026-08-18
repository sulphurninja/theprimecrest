import mongoose, { Schema } from "mongoose";

const AdSlotSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    placement: { type: String, default: "" },
    width: { type: Number, default: 728 },
    height: { type: Number, default: 90 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const AdCampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    slotKey: { type: String, required: true },
    type: { type: String, enum: ["image", "html"], default: "image" },
    imageUrl: { type: String, default: "" },
    clickUrl: { type: String, default: "" },
    html: { type: String, default: "" },
    alt: { type: String, default: "" },
    sponsorName: { type: String, default: "" },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true },
);

AdCampaignSchema.index({ slotKey: 1, active: 1, priority: -1 });

export type AdSlotDoc = mongoose.InferSchemaType<typeof AdSlotSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type AdCampaignDoc = mongoose.InferSchemaType<typeof AdCampaignSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AdSlot =
  (mongoose.models.AdSlot as mongoose.Model<AdSlotDoc>) ||
  mongoose.model<AdSlotDoc>("AdSlot", AdSlotSchema);

export const AdCampaign =
  (mongoose.models.AdCampaign as mongoose.Model<AdCampaignDoc>) ||
  mongoose.model<AdCampaignDoc>("AdCampaign", AdCampaignSchema);
