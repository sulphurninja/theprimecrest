import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import { dbConnect } from "../src/lib/db";
import { Settings } from "../src/models";

async function updateCompany() {
  await dbConnect();
  await Settings.updateOne(
    {},
    { $set: { copyright: "Fortiora Group LLC." } },
    { upsert: true },
  );
  console.log("✓ Copyright updated to Fortiora Group LLC.");
  await mongoose.disconnect();
}

updateCompany().catch(console.error);
