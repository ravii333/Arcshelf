/**
 * Promote a user to admin by email.
 *
 * Run from the server directory:
 *   node scripts/makeAdmin.js someone@example.com
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/makeAdmin.js <email>");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email: ${email}`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
  process.exit(user ? 0 : 1);
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
