const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ahnafstore");

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌", error);

    process.exit(1);
  }
};

module.exports = connectDB;