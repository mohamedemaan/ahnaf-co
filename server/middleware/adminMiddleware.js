const adminMiddleware = (req, res, next) => {
  const adminEmails = ["mohamedemaan.a@gmail.com"];

  if (!req.user) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({
      message: "Admin access denied",
    });
  }

  next();
};
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.json({ message: "No token, access denied" });
  }

  try {
    const verified = jwt.verify(token, "secretkey123");
    req.user = verified;
    next();
  } catch (err) {
    res.json({ message: "Invalid token" });
  }
};

module.exports = adminMiddleware;