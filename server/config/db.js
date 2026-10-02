const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("Full Error:");
    console.error(err);
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Cause:", err.cause);

    process.exit(1);
  }
};

module.exports = connectDB;