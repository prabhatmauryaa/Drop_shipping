const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            default: 0,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        imageUrl: {
            type: String,
            required: false,
        },
        // Supplier who actually holds the inventory
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Seller who is listing the product
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Could be null if admin/supplier just creating base products
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "active", "draft", "out_of_stock"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
