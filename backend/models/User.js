const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["admin", "supplier", "seller", "customer"],
            default: "customer",
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        resetOtp: { type: String, default: "" },
        resetOtpExpires: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
