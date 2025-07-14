const jwt = require("jsonwebtoken");

// Middleware to check if user is authenticated (has valid token)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token verification failed" });
  }
};

// Middleware to check if user is SUPERADMIN
const requireSuperAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied: Superadmin only" });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  requireSuperAdmin,
};
