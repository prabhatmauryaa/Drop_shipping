const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: { // Customer who ordered
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: false },
                price: { type: Number, required: true },
                size: { type: String, required: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                supplier: { // Automated Order Forwarding
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                }
            },
        ],
        shippingAddress: { // Doorstep Address Change allows editing this pre-dispatch
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true, default: "Card" },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: { type: Number, required: true, default: 0.0 },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },

        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },

        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },

        status: { // Order Management
            type: String,
            enum: ["Pending", "Processing", "Forwarded", "Dispatched", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Pending"
        },

        isFastDelivery: { type: Boolean, default: false }, // Quick Delivery handler

        returnRequest: { // Return & Refund System
            isRequested: { type: Boolean, default: false },
            reason: { type: String },
            imageUrl: { type: String }, // Proof of damage/issue
            status: { type: String, enum: ["None", "Pending", "Approved", "Rejected", "Refunded"], default: "None" }
        },
        hasFeedback: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
