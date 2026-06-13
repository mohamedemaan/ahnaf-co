const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String },
    phone:    { type: String },
    email:    { type: String, required: true, unique: true },
    password: { type: String },

    // OTP fields — used for register & login verification
    otp:        { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);