require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// STRICT REGEX RULES
const USERNAME_REGEX = /^[a-z][a-z0-9_]{2,19}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,16}$/;

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

// ── REGISTER ADMIN (STRICT) ──────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 1. Strict Validation
    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({ message: "Username must start with a letter and contain only lowercase letters, numbers, or underscores (3–20 characters)." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address (example: user@gmail.com)." });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ message: "Password must be 12–16 characters long and include uppercase, lowercase, number, and special character." });
    }
    
    // Disallow common passwords or username/email in password
    const lowerPass = password.toLowerCase();
    if (lowerPass.includes("password") || lowerPass.includes("admin") || lowerPass.includes("123456")) {
      return res.status(400).json({ message: "Password is too common or weak." });
    }
    if (lowerPass.includes(username.toLowerCase()) || lowerPass.includes(email.split('@')[0].toLowerCase())) {
      return res.status(400).json({ message: "Password cannot contain your username or email." });
    }

    // 2. Check Uniqueness
    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Username or Email already registered" });
    }

    // 3. Hash Password (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 12); // cost factor 12 for strong security

    // 4. Create Admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      previousPasswords: [hashedPassword],
      is_verified: true, // Auto-verifying for this demo, would send OTP normally
    });

    res.status(201).json({
      message: "Registration successful. Please login.",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal server error during registration." });
  }
});


// ── LOGIN ADMIN (STRICT & PROTECTED) ─────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // accepts username or email

    if (!identifier || !password) {
      return res.status(400).json({ message: "Username/Email and Password are required" });
    }

    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!admin) {
      // Return generic error to prevent email enumeration
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const waitMinutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(403).json({ message: `Account locked due to too many failed attempts. Try again in ${waitMinutes} minutes.` });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      admin.failedLoginAttempts += 1;
      let errorMsg = "Invalid credentials";
      
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockUntil = Date.now() + LOCK_TIME_MS;
        errorMsg = "Maximum failed attempts reached. Account locked for 15 minutes.";
      }
      
      await admin.save();
      return res.status(400).json({ message: errorMsg });
    }

    // Reset lock logic on successful login
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    await admin.save();

    // Check Verification
    if (admin.is_verified === false) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Strict 1-hour session
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal server error during login." });
  }
});

module.exports = router;