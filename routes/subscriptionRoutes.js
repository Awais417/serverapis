const express = require("express");
const router = express.Router();
const { expireSubscriptions, getSubscriptionStats } = require("../utils/expireSubscriptions");

// Handle OPTIONS
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// POST /subscription/expire - Manually trigger subscription expiration check
router.post("/expire", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const result = await expireSubscriptions();
    res.status(200).json({
      message: "Subscription expiration check completed",
      ...result,
    });
  } catch (error) {
    console.error("Expire subscriptions error:", error);
    res.status(500).json({
      error: {
        code: "500",
        message: error.message || "Failed to expire subscriptions",
      },
    });
  }
});

// GET /subscription/stats - Get subscription statistics
router.get("/stats", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const stats = await getSubscriptionStats();
    res.status(200).json({
      message: "Subscription statistics retrieved",
      stats,
    });
  } catch (error) {
    console.error("Get subscription stats error:", error);
    res.status(500).json({
      error: {
        code: "500",
        message: error.message || "Failed to get subscription statistics",
      },
    });
  }
});

module.exports = router;

