require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// OTP store (temporary)
const otpStore = {};

// ✅ SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

console.log("OTP =", otp);

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

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
    console.log("OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, otp } = req.body;

    // OTP verify
    const stored = otpStore[email];
    if (!stored) {
      return res.status(400).json({ message: "OTP not sent" });
    }
    if (Date.now() > stored.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check existing user
   const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

   const user = new User({
  name, phone,
  email: email.toLowerCase().trim(),
  password
});
    await user.save();

    delete otpStore[email];

    res.status(201).json({
      message: "Registered successfully",
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET || "secret123",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;