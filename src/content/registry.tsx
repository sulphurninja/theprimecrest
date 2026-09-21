import type { ComponentType } from "react";
import type { MagTocItem } from "../components/reader/HtmlFlipbook";
import { FoskarisPages, FOSKARIS_TOC } from "./FoskarisPages";

export type IssueDefinition = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  toc: MagTocItem[];
  Pages: ComponentType;
};

/** Every crafted issue, registered for the publish pipeline. */
export const ISSUE_REGISTRY: Record<string, IssueDefinition> = {
  foskaris: {
    slug: "foskaris",
    title: "Top 10 Unstoppable Business Leaders Making a Difference in 2026",
    kicker: "PrimeCrest · Vol. III · The Wellness Issue",
    description:
      "Red Light Pro Devices & Foskaris Wellness — Founder & CEO. A decade of holistic wellness, told in PrimeCrest's Wellness Issue.",
    toc: FOSKARIS_TOC,
    Pages: FoskarisPages,
  },
};
