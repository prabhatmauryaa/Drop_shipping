const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dropshipping_super_secret_key";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied, No Token Provided" });

    try {
        let cleanToken = token.replace("Bearer", "").trim();
        // Remove any accidentally stored double or single quotes
        cleanToken = cleanToken.replace(/^["']|["']$/g, '');
        
        const decoded = jwt.verify(cleanToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
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
