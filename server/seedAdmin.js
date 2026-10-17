require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function seedOrCheckAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ ERROR: MONGO_URI is missing in server/.env");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log(" Connected to MongoDB successfully.\n");

    // 1. List existing admins
    const existingAdmins = await Admin.find({}, "username email createdAt is_verified");
    console.log("==========================================");
    console.log("📋 EXISTING ADMIN ACCOUNTS IN DATABASE:");
    console.log("==========================================");

    if (existingAdmins.length === 0) {
      console.log("No admin accounts found yet in the database.");
    } else {
      existingAdmins.forEach((a, idx) => {
        console.log(`[${idx + 1}] Username: ${a.username} | Email: ${a.email}`);
      });
    }

    // 2. Create or Reset a known Master Admin
    const masterUsername = "superadmin";
    const masterEmail = "admin@ahnaf.com";
    const masterPassword = "MasterKey@2026"; // 14 chars, uppercase, lowercase, number, symbol

    const hashedPassword = await bcrypt.hash(masterPassword, 12);

    let admin = await Admin.findOne({
      $or: [{ username: masterUsername }, { email: masterEmail }]
    });

    if (admin) {
      admin.password = hashedPassword;
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      admin.is_verified = true;
      await admin.save();
      console.log("\n==========================================");
      console.log("✅ MASTER ADMIN PASSWORD RESET SUCCESSFULLY!");
    } else {
      admin = await Admin.create({
        username: masterUsername,
        email: masterEmail,
        password: hashedPassword,
        previousPasswords: [hashedPassword],
        is_verified: true,
      });
      console.log("\n==========================================");
      console.log("✅ NEW MASTER ADMIN CREATED SUCCESSFULLY!");
    }

    console.log("==========================================");
    console.log("🔑 LOGIN CREDENTIALS:");
    console.log("------------------------------------------");
    console.log(`👤 Username: ${masterUsername}`);
    console.log(`📧 Email   : ${masterEmail}`);
    console.log(`🔒 Password: ${masterPassword}`);
    console.log("==========================================\n");

    await mongoose.disconnect();
    console.log("Done! You can now log into your Admin page with these credentials.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running script:", err);
    process.exit(1);
  }
}

seedOrCheckAdmin();

