import mongoose, { Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    resourceType: { type: String, default: "image" },
    format: { type: String, default: "" },
    width: Number,
    height: Number,
    bytes: Number,
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    credit: { type: String, default: "" },
    folder: { type: String, default: "primecrest" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type MediaDoc = mongoose.InferSchemaType<typeof MediaSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Media =
  (mongoose.models.Media as mongoose.Model<MediaDoc>) || mongoose.model<MediaDoc>("Media", MediaSchema);
