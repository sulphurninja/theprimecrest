import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Homepage } from "@/models";
import { jsonError, jsonOk, requireAdmin } from "@/lib/api";
import { getMagazineIssues } from "@/lib/queries";

/** Magazine issues in their current display order (the first is featured). */
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  return jsonOk({ issues: await getMagazineIssues() });
}

/** Save the display order as a list of article slugs. */
export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await request.json().catch(() => null);
  const order = body?.order;
  if (!Array.isArray(order) || order.length > 500 || !order.every((slug) => typeof slug === "string" && slug)) {
    return jsonError("Send the order as a list of article slugs.");
  }
  await dbConnect();
  await Homepage.findOneAndUpdate({}, { magazineOrder: order }, { upsert: true });
  // The order shows on the homepage, /magazine, section shelves and story pages.
  revalidatePath("/", "layout");
  return jsonOk({ ok: true });
}
