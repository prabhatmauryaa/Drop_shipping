require("dotenv").config();

// Safe DNS handling: ONLY apply on local Windows machines to fix local SRV lookup.
// DO NOT override on Linux/Render so container DNS resolution works properly.
if (process.platform === "win32") {
  try {
    const dns = require("node:dns");
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
  } catch (dnsErr) {
    console.log("Local Windows DNS setServers skipped:", dnsErr.message);
  }
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const app = express();

const frontendUrl =
  process.env.FRONTEND_URL ||
  "https://drop-shipping-jyvq2oej1-prabhatmauryaas-projects.vercel.app";
const frontendUrls = [
  frontendUrl,
  "https://vastraculture.vercel.app",
];

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    const isProjectDeployment =
      origin &&
      /^https:\/\/drop-shipping-[a-z0-9-]+-prabhatmauryaas-projects\.vercel\.app$/i.test(origin);
    const isAllowedOrigin =
      !origin ||
      frontendUrls.includes(origin) ||
      origin === "http://localhost:3000" ||
      origin === "http://127.0.0.1:3000" ||
      isProjectDeployment;

    callback(null, isAllowedOrigin);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Serve Static Files with CORS headers so images can load in browser from Vercel
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
}, express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// Health Check Route for Render & Frontend monitoring
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.status(200).json({
    status: "ok",
    server: "running",
    database: dbStatusMap[dbStatus] || "unknown",
    databaseConnected: dbStatus === 1,
    timestamp: new Date().toISOString(),
  });
});

// Basic Route
app.get("/", (req, res) => {
  res.send("Drop Shipping API is running.");
});

// Database Connection & Server Setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Start HTTP server immediately so Render port check passes instantly!
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Dropshipping Backend running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

// Connect to MongoDB Atlas with auto-retry and troubleshooting logs
if (!MONGO_URI) {
  console.error("================================================================");
  console.error("❌ [FATAL ERROR] MONGO_URI is missing from environment variables!");
  console.error("👉 Please add MONGO_URI in your Render Dashboard -> Environment.");
  console.error("================================================================");
} else {
  const connectDB = () => {
    console.log("⏳ Connecting to MongoDB Atlas...");
    mongoose
      .connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log("✅ Connected to MongoDB successfully!");
      })
      .catch((error) => {
        console.error("❌ Database connection error:", error.message);
        console.error("----------------------------------------------------------------");
        console.error("Render & MongoDB Atlas Troubleshooting Guide:");
        console.error("1. Did you add 0.0.0.0/0 to MongoDB Atlas IP Access List?");
        console.error("   (Atlas Dashboard -> Network Access -> Add IP -> Allow from Anywhere)");
        console.error("2. Did you set MONGO_URI in Render Dashboard -> Environment?");
        console.error("3. Is your database username/password correct in the connection string?");
        console.error("----------------------------------------------------------------");
        console.error("⏳ Will retry connection in 5 seconds...");
        setTimeout(connectDB, 5000);
      });
  };

  connectDB();
}
