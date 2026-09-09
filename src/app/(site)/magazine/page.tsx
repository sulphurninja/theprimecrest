import { MagazineComingSoonPage } from "@/components/site/MagazineComingSoon";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Magazine — Coming Soon",
  description:
    "The PrimeCrest digital magazine is coming soon. Features, long reads, and the next cover will land here.",
  path: "/magazine",
});

export default function MagazinePage() {
  return <MagazineComingSoonPage />;
}
