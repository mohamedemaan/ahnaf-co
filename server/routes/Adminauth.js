require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
// ── REGISTER ADMIN ───────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existing = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
});


// ── LOGIN ADMIN ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        username: admin.username,
        email: admin.email,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;