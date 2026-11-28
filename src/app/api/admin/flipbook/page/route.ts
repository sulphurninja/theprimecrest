import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { cloudinaryReady, uploadBuffer } from "@/lib/cloudinary";
import { flipbookFolder } from "@/lib/folio";
import { slugify } from "@/lib/utils";

/** One rendered PDF page (JPEG) for a flipbook. Returns its Cloudinary details. */
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!cloudinaryReady()) return jsonError("Cloudinary is not configured.", 400);

  const form = await request.formData();
  const file = form.get("file");
  const slug = slugify(String(form.get("slug") || ""));
  const index = Number(form.get("index") || 0);
  if (!(file instanceof File) || !slug) return jsonError("A page image and the story slug are required.");
  if (!file.type.startsWith("image/")) return jsonError("Pages must be images.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `page-${String(index + 1).padStart(3, "0")}.jpg`;
  const uploaded = await uploadBuffer(buffer, name, file.type, flipbookFolder(slug));
  return jsonOk({
    page: {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      width: uploaded.width || 0,
      height: uploaded.height || 0,
    },
  });
}
