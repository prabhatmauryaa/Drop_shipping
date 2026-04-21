const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc    Create new order (Module 6 & Module 7 & Module 5 Inventory deduction)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, isFastDelivery } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        } else {
            // Check inventory (Module 5)
            for (let item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) return res.status(400).json({ message: `Product ${item.name} no longer exists in inventory.` });
                if (product.stock < item.qty) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
                }
            }

            const order = new Order({
                orderItems,
                user: req.user.id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isFastDelivery,
                status: "Forwarded" // Module 7: Automatically forwarded
            });

            const createdOrder = await order.save();

            // Module 5: Deduct stock after order creation
            for (let item of orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock -= item.qty;
                    await product.save();
                }
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Get logged in user orders
router.get("/myorders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id || req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Dashboard Orders Fetch Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Get order by ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (order) res.json(order);
        else res.status(404).json({ message: "Order not found" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Update order status (including Delivery)
router.put("/:id/status", authMiddleware, authorizeRoles("admin", "supplier", "seller"), async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status;
        if (req.body.status === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// @desc    Update Order Address (Module 9 - Expanded rules)
router.put("/:id/address", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            if (order.status === "Delivered" || order.status === "Cancelled") {
                return res.status(400).json({ message: "Cannot change address for delivered or cancelled orders" });
            }
            order.shippingAddress = req.body.shippingAddress;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Request Return (Module 11)
router.post("/:id/return", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order && (order.isDelivered || order.status === "Delivered")) {
            order.returnRequest = {
                isRequested: true,
                reason: req.body.reason,
                imageUrl: req.body.imageUrl,
                status: "Pending"
            };
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: "Order must be in 'Delivered' status to request a return." });
        }
    } catch (error) {
        console.error("Return Request Error:", error);
        res.status(500).json({ message: "Server Error during return submission", error: error.message });
    }
});



// @desc    Approve or Reject a Return Request (Module 11 - Supplier/Admin)
router.put("/:id/return-status", authMiddleware, authorizeRoles("admin", "supplier", "seller"), async (req, res) => {
    try {
        const { status } = req.body; // "Approved" or "Rejected"
        if (!["Approved", "Rejected", "Refunded"].includes(status)) {
            return res.status(400).json({ message: "Invalid return status" });
        }
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (!order.returnRequest?.isRequested) {
            return res.status(400).json({ message: "No return request found for this order" });
        }
        order.returnRequest.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @desc    Get all orders (Admin/Supplier module view)
router.get("/", authMiddleware, authorizeRoles("admin", "supplier", "seller"), async (req, res) => {
    let filter = {};
    if (req.user.role === "supplier" || req.user.role === "seller") {
        filter = { "orderItems.supplier": req.user.id };
    }
    const orders = await Order.find(filter).populate("user", "id name");
    res.json(orders);
});

module.exports = router;
