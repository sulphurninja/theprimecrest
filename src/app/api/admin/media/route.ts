import { dbConnect } from "@/lib/db";
import { Media } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { cloudinaryReady, uploadBuffer } from "@/lib/cloudinary";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const items = await Media.find().sort({ createdAt: -1 }).limit(200).lean();
  return jsonOk({ items, cloudinary: cloudinaryReady() });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error || !session) return error;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("Choose a file to upload.");

  const alt = String(form.get("alt") || "");
  const caption = String(form.get("caption") || "");
  const credit = String(form.get("credit") || "");

  if (!cloudinaryReady()) {
    return jsonError(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.",
      400,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadBuffer(buffer, file.name, file.type);
  await dbConnect();
  const item = await Media.create({
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    resourceType: uploaded.resource_type,
    format: uploaded.format,
    width: uploaded.width,
    height: uploaded.height,
    bytes: uploaded.bytes,
    alt,
    caption,
    credit,
    uploadedBy: session.sub,
  });
  return jsonOk({ item }, 201);
}
