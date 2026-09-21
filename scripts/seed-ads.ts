/**
 * Seeds Zaptick and A3M campaigns into every ad slot.
 * Non-destructive to other data; replaces only these two sponsors' campaigns.
 * Run with: node --env-file=.env.local --import tsx scripts/seed-ads.ts
 */
import mongoose from "mongoose";
import { dbConnect } from "../src/lib/db";
import { AdSlot, AdCampaign } from "../src/models";
import { AD_SLOTS } from "../src/lib/constants";

const ZAPTICK = {
  sponsorName: "Zaptick",
  clickUrl: "https://zaptick.io",
  alt: "Zaptick — The Operating System for Communication. Start free at zaptick.io",
};

const A3M = {
  sponsorName: "A3M",
  clickUrl: "https://thea3m.com",
  alt: "A3M — AI systems for enterprise & intelligence agencies. Intelligence that ships.",
};

/** Which creative size each slot takes. */
const SLOT_SIZE: Record<string, string> = {
  "header-leaderboard": "970x90",
  "homepage-mid": "728x90",
  "homepage-mpu": "300x250",
  "article-inline": "728x90",
  "article-sidebar": "300x600",
  "category-top": "728x90",
  "footer-strip": "970x90",
};

/** Primary sponsor per slot — the other brand sits behind at lower priority. */
const PRIMARY: Record<string, "zaptick" | "a3m"> = {
  "header-leaderboard": "zaptick",
  "homepage-mid": "a3m",
  "homepage-mpu": "zaptick",
  "article-inline": "a3m",
  "article-sidebar": "a3m",
  "category-top": "zaptick",
  "footer-strip": "zaptick",
};

async function main() {
  console.log("Connecting to MongoDB…");
  await dbConnect();

  // Make sure all slots exist and are enabled
  for (const s of AD_SLOTS) {
    await AdSlot.findOneAndUpdate(
      { key: s.key },
      { $set: { ...s, enabled: true } },
      { upsert: true },
    );
  }

  // Clear previous Zaptick/A3M campaigns, then insert fresh ones
  await AdCampaign.deleteMany({ sponsorName: { $in: ["Zaptick", "A3M"] } });

  const docs = Object.entries(SLOT_SIZE).flatMap(([slotKey, size]) => {
    const primary = PRIMARY[slotKey];
    return (["zaptick", "a3m"] as const).map((brand) => {
      const meta = brand === "zaptick" ? ZAPTICK : A3M;
      return {
        name: `${meta.sponsorName} — ${slotKey}`,
        slotKey,
        type: "image" as const,
        imageUrl: `/ads/${brand}-${size}.png`,
        clickUrl: meta.clickUrl,
        alt: meta.alt,
        sponsorName: meta.sponsorName,
        active: true,
        priority: brand === primary ? 10 : 5,
      };
    });
  });

  await AdCampaign.insertMany(docs);
  console.log(`Seeded ${docs.length} campaigns across ${Object.keys(SLOT_SIZE).length} slots.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
