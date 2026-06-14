require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ SEND OTP
router.get("/test", (req,res)=>{
  res.json({
    success:true,
    message:"Auth route working"
  });
});
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in DB — works on serverless since it persists in MongoDB
    // upsert: create a temp record if user doesn't exist yet (for register flow)
    await User.findOneAndUpdate(
  { email },
  { email, otp, otpExpires },
  { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP - EmmanStore",
      html: `
        <h2>EmmanStore Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#000; letter-spacing:5px">${otp}</h1>
        <p>Valid for 5 minutes only.</p>
      `,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, otp } = req.body;

    const stored = await User.findOne({ email });
    if (!stored || !stored.otp) {
      return res.status(400).json({ message: "OTP not sent" });
    }
    if (Date.now() > new Date(stored.otpExpires).getTime()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // If user already has a password set, they're already registered
    if (stored.password) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    stored.name     = name;
    stored.phone    = phone;
    stored.password = hashedPassword;
    stored.otp        = undefined;
    stored.otpExpires = undefined;
    await stored.save();

    res.status(201).json({
      message: "Registered successfully",
      user: { name: stored.name, email: stored.email }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!user.otp) {
      return res.status(400).json({ message: "OTP not sent" });
    }
    if (Date.now() > new Date(user.otpExpires).getTime()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;