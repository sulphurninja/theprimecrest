"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/components/admin/api";
import { ArticleForm, EMPTY_ARTICLE, type ArticleFormValue } from "@/components/admin/ArticleForm";
import { AdminLoader } from "@/components/admin/ui";

type Loaded = Record<string, unknown> & {
  _id: string;
  category?: { _id: string } | string;
  author?: { _id: string } | string;
  publishedAt?: string;
  pullQuote?: { text?: string; attribution?: string };
};

function toFormValue(item: Loaded): ArticleFormValue {
  const refId = (v: { _id: string } | string | undefined) =>
    typeof v === "object" && v ? v._id : (v as string) || "";
  return {
    ...EMPTY_ARTICLE,
    ...Object.fromEntries(
      Object.entries(item).filter(([k]) => k in EMPTY_ARTICLE || k === "_id"),
    ),
    _id: item._id,
    category: refId(item.category),
    author: refId(item.author),
    publishedAt: item.publishedAt ? String(item.publishedAt).slice(0, 16) : "",
    tags: (item.tags as string[]) || [],
    pullQuote: {
      text: item.pullQuote?.text || "",
      attribution: item.pullQuote?.attribution || "",
    },
  } as ArticleFormValue;
}

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<ArticleFormValue | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ item: Loaded }>(`/api/admin/articles/${id}`)
      .then((data) => setInitial(toFormValue(data.item)))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."));
  }, [id]);

  if (error) {
    return <p className="py-20 text-center font-sans text-[0.9rem] text-accent">{error}</p>;
  }
  if (!initial) return <AdminLoader />;
  return <ArticleForm initial={initial} />;
}
