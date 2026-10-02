const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Admin = require("./models/Admin");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const existingAdmin = await Admin.findOne({ email: "admin@ahnaf.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      fullName: "Super Admin",
      username: "admin",
      email: "admin@ahnaf.com",
      password: hashedPassword,
    });

    console.log("Default Admin Created Successfully!");
    console.log("Email: admin@ahnaf.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
