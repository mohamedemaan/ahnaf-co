const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Allow if role is explicitly admin (from AdminAuth)
  if (req.user.role === "admin") {
    return next();
  }

  // Fallback for older tokens/users
  const adminEmails = ["emmann.2006@gmail.com", "admin@ahnaf.com"];

  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({ message: "Admin access denied" });
  }

  next();
};

module.exports = adminMiddleware;