const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const adminEmails = ["emmann.2006@gmail.com"];

  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({ message: "Admin access denied" });
  }

  next();
};

module.exports = adminMiddleware;