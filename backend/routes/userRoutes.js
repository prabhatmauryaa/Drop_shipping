const express = require("express");
const User = require("../models/User");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

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

// Update User Address
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

// Update User Location (lat/lng) for Quick Delivery
router.put("/location", authMiddleware, async (req, res) => {
    try {
        const { lat, lng } = req.body;
        if (lat === undefined || lng === undefined) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { location: { lat, lng } },
            { new: true }
        ).select("-password");
        res.status(200).json({ message: "Location updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Fetch locations for a list of user IDs (Suppliers)
router.post("/locations", authMiddleware, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: "List of IDs is required" });
        }
        const users = await User.find({ _id: { $in: ids } }).select("location");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get all suppliers (Public)
router.get("/suppliers", async (req, res) => {
    try {
        const suppliers = await User.find({ role: "supplier" }).select("name email phone location");
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;

