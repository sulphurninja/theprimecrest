import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import { dbConnect } from "../src/lib/db";
import { Settings } from "../src/models";

async function updateSocials() {
  await dbConnect();

  await Settings.updateOne(
    {},
    {
      $set: {
        "socials.twitter": "",
        "socials.instagram": "https://www.instagram.com/primecrest_",
        "socials.linkedin": "",
        "socials.facebook": "",
        "socials.youtube": "",
      },
    },
    { upsert: true }
  );

  console.log("✓ Social links updated — only Instagram is now active");
  await mongoose.disconnect();
}

updateSocials().catch(console.error);
