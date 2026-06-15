require("dotenv").config();
const express     = require("express");
const router      = express.Router();
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const Admin       = require("../models/Admin");
const transporter = require("../config/mailer");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admin OTP - EmmanStore",
      html: `
        <h2>EmmanStore Admin Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#000; letter-spacing:5px">${otp}</h1>
        <p>Valid for 5 minutes only.</p>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Admin OTP Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ── REGISTER ADMIN ───────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!fullName || !username || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const stored = await PendingOtp.findOne({ email });
    if (!stored) return res.status(400).json({ message: "OTP not sent" });
    if (Date.now() > new Date(stored.otpExpires).getTime()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (stored.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const exists = await Admin.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await PendingOtp.deleteOne({ email });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { fullName: admin.fullName, username: admin.username, email: admin.email },
    });
  } catch (err) {
    console.error("Admin Register Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN ADMIN ──────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required"
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;

// ── PendingOtp model (inline for simplicity) ────────────────────────────────
const mongoose = require("mongoose");
const pendingOtpSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  otp:        String,
  otpExpires: Date,
});
const PendingOtp = mongoose.models.PendingOtp || mongoose.model("PendingOtp", pendingOtpSchema);