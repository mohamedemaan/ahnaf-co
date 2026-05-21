const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check user exists
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Invalid password" });

    // 3. create token
    const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
  },
  "mysecretkey",
  {
    expiresIn: "7d",
  }
);

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;