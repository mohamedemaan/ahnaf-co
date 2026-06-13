const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");
const User    = require("../models/User");

// NOTE: admin.js only handles routes that don't fit elsewhere.
// Order GET/PUT are now in order.js and mounted at /api/orders in server.js.
// Keep this file for any future admin-only endpoints (users, stats, etc.)

// ── GET all users (admin) ─────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE user (admin) ───────────────────────────────────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;