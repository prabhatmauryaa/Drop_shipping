const express = require("express");
const Product = require("../models/Product");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Get All Approved/Active Products (Public)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({ status: { $in: ["approved", "active"] } }).populate("supplier", "name email").populate("seller", "name email");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get Distinct Products for specific dashboard Role
router.get("/dashboard", authMiddleware, authorizeRoles("admin", "seller", "supplier"), async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === "supplier") filter = { supplier: req.user.id };

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Create Product (Supplier, Admin)
router.post("/", authMiddleware, authorizeRoles("admin", "supplier"), async (req, res) => {
    try {
        const { title, description, price, stock, category, imageUrl, supplier } = req.body;

        if (!title || !description || !price || !stock || !category) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const newProduct = new Product({
            title,
            description,
            price,
            stock,
            category,
            imageUrl,
            supplier: supplier || req.user.id, // default to self if not specified (for suppliers)
        });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update Product
router.put("/:id", authMiddleware, authorizeRoles("admin", "seller", "supplier"), async (req, res) => {
    try {
        // Find if product exists
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Admin can update any product
        if (req.user.role === "admin") {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        }

        // Non-admin users can only update their own products
        if (product.supplier.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Delete Product
router.delete("/:id", authMiddleware, authorizeRoles("admin", "seller", "supplier"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Admin can delete any product
        if (req.user.role === "admin") {
            await Product.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Product deleted successfully" });
        }

        // Non-admin users can only delete their own products
        if (product.supplier.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ADMIN ONLY: Get All Pending Products
router.get("/admin/pending", authMiddleware, authorizeRoles("admin", "seller"), async (req, res) => {
    try {
        const products = await Product.find({ status: "pending" }).populate("supplier", "name email");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN ONLY: Approve Product
router.put("/admin/approve/:id", authMiddleware, authorizeRoles("admin", "seller"), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product approved", product });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN ONLY: Reject Product
router.put("/admin/reject/:id", authMiddleware, authorizeRoles("admin", "seller"), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product rejected", product });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
