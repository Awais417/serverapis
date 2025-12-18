// Vercel Serverless Function for cron job
// This endpoint is called by Vercel Cron to expire subscriptions
const { expireSubscriptions } = require("../utils/expireSubscriptions");

module.exports = async (req, res) => {
  try {
    const result = await expireSubscriptions();
    res.status(200).json({
      message: "Subscription expiration check completed",
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error("Cron job - Expire subscriptions error:", error);
    res.status(500).json({
      error: {
        code: "500",
        message: error.message || "Failed to expire subscriptions",
      },
    });
  }
};

