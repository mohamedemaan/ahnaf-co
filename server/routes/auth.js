require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER (OTP இல்லாம)
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing && existing.password) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = existing || new User({ email });
    user.name = name;
    user.phone = phone;
    user.password = hashedPassword;
    await user.save();

    res.status(201).json({
      message: "Registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN (OTP இல்லாம)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;