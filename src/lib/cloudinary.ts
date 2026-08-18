import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function cloudinaryReady() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getCloudinary() {
  if (!cloudinaryReady()) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export function uploadBuffer(buffer: Buffer, filename: string, mime: string) {
  const client = getCloudinary();
  const folder = process.env.CLOUDINARY_FOLDER || "primecrest";
  const resourceType = mime.startsWith("video/")
    ? "video"
    : mime.startsWith("audio/")
      ? "video"
      : mime === "application/pdf"
        ? "raw"
        : "image";

  return new Promise<{
    public_id: string;
    secure_url: string;
    resource_type: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
  }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: filename.replace(/\.[^.]+$/, ""),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function destroyAsset(publicId: string, resourceType = "image") {
  const client = getCloudinary();
  await client.uploader.destroy(publicId, { resource_type: resourceType });
}
