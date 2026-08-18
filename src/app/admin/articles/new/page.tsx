"use client";

import { ArticleForm, EMPTY_ARTICLE } from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return <ArticleForm initial={EMPTY_ARTICLE} />;
}
