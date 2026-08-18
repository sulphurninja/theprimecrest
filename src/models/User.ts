import mongoose, { Schema } from "mongoose";

const SocialSchema = new Schema(
  {
    twitter: String,
    linkedin: String,
    instagram: String,
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "author"], default: "author" },
    slug: { type: String, required: true, unique: true },
    title: { type: String, default: "Staff Writer" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    socials: { type: SocialSchema, default: {} },
  },
  { timestamps: true },
);

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User =
  (mongoose.models.User as mongoose.Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema);
