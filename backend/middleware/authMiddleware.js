const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dropshipping_super_secret_key";

const authMiddleware = (req, res, next) => {
 const authorization = req.header("Authorization");
 if (!authorization) {
  return res.status(401).json({ message: "Access denied. Please log in to continue." });
 }

 try {
 const cleanToken = authorization.replace(/^Bearer\s+/i, "").trim().replace(/^["']|["']$/g, "");
 if (!cleanToken) {
  return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
 }

 const decoded = jwt.verify(cleanToken, JWT_SECRET);
 req.user = decoded;
 next();
 } catch (error) {
 res.status(401).json({ message: "Invalid or expired token. Please log in again." });
 }
};

const authorizeRoles = (...roles) => {
 return (req, res, next) => {
 if (!roles.includes(req.user.role)) {
 return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
 }
 next();
 };
};

module.exports = { authMiddleware, authorizeRoles };
