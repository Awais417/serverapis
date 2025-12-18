const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

// Handle OPTIONS for coupon routes
router.options("*", (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204);
  } catch (error) {
    console.error("OPTIONS handler error:", error);
    res.header("Access-Control-Allow-Origin", "*");
    res.sendStatus(204);
  }
});

// Validate coupon code
router.post("/validate", couponController.validateCoupon);

module.exports = router;

