const express = require("express");
const Review = require("../models/Review");
const Order = require("../models/Order");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc Create a product rating or supplier rating 
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

// @desc Process instant feedback popup 
router.post("/instant", authMiddleware, async (req, res) => {
    try {
        const { rating, comment, orderId } = req.body; 
        // Find the order to get at least one product for context
        const order = await Order.findById(orderId);
        const firstProduct = order?.orderItems?.[0]?.product;

        const feedback = new Review({
            user: req.user.id,
            product: firstProduct, // Associate with the first product of the order
            rating,
            comment: comment || "Feedback Received",
            isInstantFeedback: true, 
            description: `Order Feedback (#${orderId?.substring(0,8)})`
        });
        await feedback.save();

        // Update the order to mark that feedback has been received
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { hasFeedback: true });
        }

        res.status(201).json({ message: "Feedback saved!" });
    } catch (err) {
        console.error("Feedback Error:", err);
        res.status(500).json({ message: "Error saving feedback" });
    }
});

// Get all reviews for the dashboard
router.get("/dashboard-reviews", authMiddleware, async (req, res) => {
    try {
        const reviews = await Review.find().populate("user", "name").populate("product", "title images").sort({ createdAt: -1 });
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
