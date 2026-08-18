import mongoose, { Schema } from "mongoose";

const InquirySchema = new Schema(
  {
    type: { type: String, enum: ["advertise", "contact", "editorial"], default: "contact" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, default: "" },
    budget: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
  },
  { timestamps: true },
);

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
  },
  { timestamps: true },
);

export type InquiryDoc = mongoose.InferSchemaType<typeof InquirySchema> & {
  _id: mongoose.Types.ObjectId;
};
export type SubscriberDoc = mongoose.InferSchemaType<typeof SubscriberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inquiry =
  (mongoose.models.Inquiry as mongoose.Model<InquiryDoc>) ||
  mongoose.model<InquiryDoc>("Inquiry", InquirySchema);

export const Subscriber =
  (mongoose.models.Subscriber as mongoose.Model<SubscriberDoc>) ||
  mongoose.model<SubscriberDoc>("Subscriber", SubscriberSchema);
