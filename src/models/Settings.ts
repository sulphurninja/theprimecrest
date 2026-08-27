import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
  {
    siteName: { type: String, default: "PrimeCrest" },
    tagline: { type: String, default: "A journal of affairs, business, and culture." },
    description: { type: String, default: "" },
    issueLabel: { type: String, default: "Vol. IV · No. 33" },
    ticker: { type: String, default: "" },
    logo: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    socials: {
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "https://www.instagram.com/primecrest_" },
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    contactEmail: { type: String, default: "desk@primecrest.com" },
    advertiseEmail: { type: String, default: "advertise@primecrest.com" },
    analyticsId: { type: String, default: "" },
    magazineLink: { type: String, default: "" },
    magazineCover: { type: String, default: "" },
    magazinePdf: { type: String, default: "" },
    footerBlurb: { type: String, default: "" },
    copyright: { type: String, default: "Fortiora Group LLC." },
  },
  { timestamps: true },
);

export type SettingsDoc = mongoose.InferSchemaType<typeof SettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Settings =
  (mongoose.models.Settings as mongoose.Model<SettingsDoc>) ||
  mongoose.model<SettingsDoc>("Settings", SettingsSchema);
