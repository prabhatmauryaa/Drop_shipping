const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dropshipping_super_secret_key";

const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

// Get All Users (Admin/Seller Only) - Role Management
router.get("/all", authMiddleware, authorizeRoles("admin", "seller"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update Role (Admin/Seller Only)
router.put("/update-role/:id", authMiddleware, authorizeRoles("admin", "seller"), async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        res.status(200).json({ message: "Role updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update User Address (one-time change enforced on frontend)
router.put("/address", authMiddleware, async (req, res) => {
    try {
        const { street, city, state, zip, country } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { address: { street, city, state, zip, country } },
            { new: true }
        ).select("-password");
        res.status(200).json({ message: "Address updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
