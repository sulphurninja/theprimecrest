import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noIndex?: boolean;
};

export function buildMetadata(input: SeoInput): Metadata {
  const title =
    input.title === SITE.name ? SITE.name : `${input.title} · ${SITE.name}`;
  const description = input.description || SITE.description;
  const url = siteUrl(input.path || "/");
  const image = input.image || siteUrl("/og.jpg");

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.type || "website",
      siteName: SITE.name,
      title: input.title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      authors: input.authors,
      section: input.section,
      tags: input.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [image],
    },
  };
}

export function newsArticleJsonLd(input: {
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  url: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Person",
      name: input.authorName,
      url: input.authorUrl,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE.name,
      url: siteUrl(),
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/favicon.svg"),
      },
      parentOrganization: {
        "@type": "Organization",
        name: SITE.company,
        url: "https://thefortiora.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.state,
          postalCode: SITE.address.zip,
          addressCountry: SITE.address.country,
        },
      },
    },
    mainEntityOfPage: input.url,
    articleSection: input.section,
  };
}
