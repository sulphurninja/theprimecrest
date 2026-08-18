import { dbConnect } from "@/lib/db";
import { User } from "@/models";
import { requireAdmin, jsonError, jsonOk } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  await dbConnect();
  const items = await User.find().select("-passwordHash").sort({ name: 1 }).lean();
  return jsonOk({ items });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json();
  if (!body.name || !body.email || !body.password) {
    return jsonError("Name, email, and password are required.");
  }
  await dbConnect();
  const email = String(body.email).toLowerCase().trim();
  if (await User.findOne({ email })) return jsonError("Email already in use.");
  const item = await User.create({
    name: body.name,
    email,
    passwordHash: await hashPassword(body.password),
    role: body.role || "author",
    slug: slugify(body.slug || body.name),
    title: body.title || "Staff Writer",
    bio: body.bio || "",
    avatar: body.avatar || "",
  });
  return jsonOk({ item: { ...item.toObject(), passwordHash: undefined } }, 201);
}
