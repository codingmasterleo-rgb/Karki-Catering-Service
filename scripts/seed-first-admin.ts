// scripts/seed-first-admin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "@/models/authentication/user";

async function seedFirstAdmin() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists bhai, dobara seed karne ki zaroorat nahi:", existingAdmin.email);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("ChangeMe@123456", 10);

  const admin = await User.create({
    username: "superadmin",
    email: "admin@kcs.com",
    password: hashedPassword,
    invitationCode: "SEED-BOOTSTRAP",
    role: "admin",
    status: "approved",
    emailVerified: true,
    profileDetails: null,
    logs: [
      {
        action: "created",
        performedBy: null,
        note: "Bootstrap seed — first admin, no inviter",
        timestamp: new Date(),
      },
    ],
  });

  console.log("Bootstrap admin ready:", admin.email, "/ password: ChangeMe@123456");
  await mongoose.disconnect();
}

seedFirstAdmin().catch((err) => {
  console.error("Seed fail ho gaya:", err);
  process.exit(1);
});