import { jsonError } from "@/lib/api";
import { getNews, isNewsTopic } from "@/lib/news";
import { NextResponse } from "next/server";

/** Headlines for one topic, for the homepage news tabs. Cached upstream in getNews. */
export async function GET(request: Request) {
  const topic = new URL(request.url).searchParams.get("topic") || "business";
  if (!isNewsTopic(topic)) return jsonError("Unknown topic.");
  const items = await getNews(topic, 10);
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } },
  );
}
