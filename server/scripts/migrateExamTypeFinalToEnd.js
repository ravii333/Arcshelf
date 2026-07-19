/**
 * One-time migration: rename examType "Final Sem" -> "End Sem".
 *
 * Run from the server directory:
 *   node scripts/migrateExamTypeFinalToEnd.js
 *
 * Safe to re-run (idempotent): if no "Final Sem" records remain it simply reports 0 updated.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Update the raw collection so we don't trip the (new) schema enum validation.
  const result = await mongoose.connection
    .collection("questions")
    .updateMany({ examType: "Final Sem" }, { $set: { examType: "End Sem" } });

  console.log(
    `Matched ${result.matchedCount}, modified ${result.modifiedCount} record(s): "Final Sem" -> "End Sem".`
  );

  await mongoose.disconnect();
  console.log("Done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
