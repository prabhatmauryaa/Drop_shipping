const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dropshipping_super_secret_key";

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "customer",
            phone,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, name, email, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER || "your_email@gmail.com",
                pass: process.env.EMAIL_PASS || "your_app_password"
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || "support@vastraculture.com",
            to: email,
            subject: "Vastra culture - Your Password Reset Code",
            html: `<h3>Your securely generated Password Reset OTP is: <b>${otp}</b></h3><p>It remains valid for 10 minutes. Do not share it.</p>`
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== "your_email@gmail.com") {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "OTP sent to your email successfully!" });
        } else {
            console.log(`[TEST MODE] OTP generated for ${email}: ${otp}`);
            res.status(200).json({ message: "Test Mode: OTP bypassed to console", otp_demo: otp });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, resetOtp: otp, resetOtpExpires: { $gt: Date.now() } });
        
        if (!user) return res.status(400).json({ message: "Invalid or expired OTP code!" });
        res.status(200).json({ message: "OTP Code verified successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Reset Password Core
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

        const user = await User.findOne({ email, resetOtp: otp, resetOtpExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Invalid session timeout. Please restart verification." });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset perfectly! You can log in securely now." });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
