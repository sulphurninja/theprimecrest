import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";

export const PUBLISHER = {
  name: "Fortiora Group LLC",
  brand: "Fortiora Group",
  url: "https://thefortiora.com",
  email: "Hello@thefortiora.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "30 N Gould St Ste R",
    addressLocality: "Sheridan",
    addressRegion: "WY",
    postalCode: "82801",
    addressCountry: "US",
  },
} as const;

type IssueSeoInput = {
  title: string;
  description: string;
  slug: string;
  ogImage?: string;
  kicker?: string;
};

export function issueMetadata(input: IssueSeoInput): Metadata {
  const url = siteUrl(`/m/${input.slug}`);
  const image = input.ogImage || siteUrl("/og-default.jpg");
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "PrimeCrest",
      title: input.title,
      description: input.description,
      url,
      locale: "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
    other: { publisher: PUBLISHER.name },
  };
}

export function issueJsonLd(input: IssueSeoInput & { datePublished?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    name: input.title,
    description: input.description,
    url: siteUrl(`/m/${input.slug}`),
    image: input.ogImage || siteUrl("/og-default.jpg"),
    datePublished: input.datePublished || undefined,
    isPartOf: {
      "@type": "Periodical",
      name: "PrimeCrest",
      publisher: {
        "@type": "Organization",
        name: PUBLISHER.name,
        url: PUBLISHER.url,
        email: PUBLISHER.email,
        address: PUBLISHER.address,
      },
    },
  };
}

export function IssueJsonLdScript({
  input,
}: {
  input: IssueSeoInput & { datePublished?: string | null };
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(issueJsonLd(input)) }}
    />
  );
}
