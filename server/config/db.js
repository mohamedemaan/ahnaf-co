const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.mongodb+srv://mohamedemaan:Emman%402006@cluster0.mkuj53g.mongodb.net/emmanstore || "mongodb://localhost:27017/ahnafstore"
    );
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;