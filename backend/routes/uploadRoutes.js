const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadDir = path.join(__dirname, "../uploads/products");
if (!cloudinaryConfigured && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = cloudinaryConfigured
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
      },
    });

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "drop-shipping/products", resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary did not return an image URL."));
          return;
        }
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });

const uploadFiles = async (files) => {
  const results = await Promise.allSettled(files.map(uploadToCloudinary));
  const failedResult = results.find((result) => result.status === "rejected");

  if (failedResult) {
    const successfulUploads = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
    await Promise.allSettled(
      successfulUploads.map((image) => cloudinary.uploader.destroy(image.public_id))
    );
    throw failedResult.reason;
  }

  return results.map((result) => result.value.secure_url);
};

router.post(
  "/products",
  authMiddleware,
  (req, res, next) => {
    if (process.env.NODE_ENV === "production" && !cloudinaryConfigured) {
      return res.status(503).json({
        message: "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the backend.",
      });
    }

    upload.array("images", 5)(req, res, (error) => {
      if (!error) return next();
      if (error instanceof multer.MulterError) {
        const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({ message: error.message });
      }
      return res.status(400).json({ message: error.message || "Image upload failed." });
    });
  },
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    try {
      if (cloudinaryConfigured) {
        const images = await uploadFiles(req.files);
        return res.status(200).json({ images });
      }

      const baseUrl = (process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`)
        .replace(/\/+$/, "");
      const images = req.files.map(
        (file) => `${baseUrl}/uploads/products/${file.filename}`
      );
      return res.status(200).json({ images });
    } catch (error) {
      console.error("Product image upload failed:", error);
      return res.status(502).json({
        message: error.message || "Image upload failed. Please try again.",
      });
    }
  }
);

module.exports = router;
