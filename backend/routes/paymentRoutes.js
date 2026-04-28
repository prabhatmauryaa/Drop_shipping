const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Razorpay 
// Note: In production these keys must come from process.env
// We'll use dummy test keys for illustration that you can replace
const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey12345",
 key_secret: process.env.RAZORPAY_SECRET || "dummy_secret_key_67890",
});

// @desc Get Razorpay Key ID
router.get("/key", authMiddleware, (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey12345" });
});

// @desc Create Razorpay Order
router.post("/create-order", authMiddleware, async (req, res) => {
 try {
   if (req.user.role === "admin" || req.user.role === "supplier") {
     return res.status(403).json({ message: "Suppliers and Admins are not allowed to place orders." });
   }
 const { amount } = req.body;
 
 const options = {
 amount: Math.round(amount * 100), // Razorpay amount is in paise (lowest denomination)
 currency: "INR",
 receipt: `receipt_order_${Date.now()}`,
 };

 const order = await razorpay.orders.create(options);
 
 if (!order) {
 return res.status(500).json({ message: "Some error occured creating Razorpay order" });
 }
 res.json(order);
 } catch (error) {
 res.status(500).json({ message: "Server Error", error: error.message });
 }
});

// @desc Verify Razorpay Payment Details
router.post("/verify", authMiddleware, async (req, res) => {
 try {
   if (req.user.role === "admin" || req.user.role === "supplier") {
     return res.status(403).json({ message: "Suppliers and Admins are not allowed to place orders." });
   }
 const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
 
 // Verifying the signature
 const sign = razorpay_order_id + "|" + razorpay_payment_id;
 const expectedSign = crypto
.createHmac("sha256", process.env.RAZORPAY_SECRET || "dummy_secret_key_67890")
.update(sign.toString())
.digest("hex");

 if (razorpay_signature === expectedSign) {
 return res.status(200).json({ message: "Payment verified successfully" });
 } else {
 return res.status(400).json({ message: "Invalid signature sent!" });
 }
 } catch (error) {
 res.status(500).json({ message: "Server Error", error: error.message });
 }
});

module.exports = router;
