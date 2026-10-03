const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Security & Auth Protection
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    previousPasswords: [{ type: String }],
    
    is_verified: { type: Boolean, default: false },

    // OTP fields — used for login verification
    otp:        { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);