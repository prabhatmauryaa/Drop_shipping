const express = require("express");
const Review = require("../models/Review");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc Create a product rating or supplier rating (Module 12)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { product, supplier, rating, comment } = req.body;
        
        // Ensure user is providing rating
        const existingReview = await Review.findOne({ user: req.user.id, product });
        if (existingReview && product) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = new Review({
            user: req.user.id,
            product,
            supplier,
            rating,
            comment
        });
        await review.save();
        res.status(201).json({ message: "Review generated" });
    } catch(err) {
        res.status(500).json({ message: "Server error" });
    }
});

// @desc Process instant feedback popup (Module 13)
router.post("/instant", authMiddleware, async (req, res) => {
    try {
        const { rating, comment, orderId } = req.body; 
        const feedback = new Review({
            user: req.user.id,
            rating,
            comment: comment || "Feedback Received",
            isInstantFeedback: true, 
            description: `Order Feedback (#${orderId?.substring(0,8)})`
        });
        await feedback.save();
        res.status(201).json({ message: "Feedback saved!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving feedback" });
    }
});

// Get all reviews for the dashboard
router.get("/dashboard-reviews", authMiddleware, async (req, res) => {
    try {
        const reviews = await Review.find().populate("user", "name").sort({ createdAt: -1 }).limit(10);
        res.json(reviews);
    } catch(err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get reviews (Supplier/Admin uses this)
router.get("/:productId", async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
});

module.exports = router;
