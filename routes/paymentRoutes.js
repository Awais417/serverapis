const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Create checkout session
router.post("/create-checkout-session", paymentController.createCheckoutSession);

// Get user payment status
router.get("/status/:userId", paymentController.getPaymentStatus);

// Verify payment session (after redirect)
router.post("/verify-session", paymentController.verifySession);

// Stripe webhook (must be before express.json middleware in index.js)
// This route needs raw body, so we'll handle it separately in index.js

module.exports = router;


