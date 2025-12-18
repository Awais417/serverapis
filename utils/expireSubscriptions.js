const User = require("../models/User");

/**
 * Check and expire subscriptions that have passed their expiry date
 * This function should be called periodically (e.g., via cron job or scheduled task)
 */
const expireSubscriptions = async () => {
  try {
    const now = new Date();
    
    // Find all users with active subscriptions that have expired
    const expiredUsers = await User.find({
      subscriptionStatus: "active",
      subscriptionExpiryDate: { $lte: now },
    });

    if (expiredUsers.length === 0) {
      console.log("No subscriptions to expire");
      return { expired: 0, users: [] };
    }

    // Update all expired subscriptions
    const updateResult = await User.updateMany(
      {
        subscriptionStatus: "active",
        subscriptionExpiryDate: { $lte: now },
      },
      {
        $set: {
          subscriptionStatus: "expired",
          paymentStatus: false,
        },
      }
    );

    console.log(`Expired ${updateResult.modifiedCount} subscription(s)`);
    
    return {
      expired: updateResult.modifiedCount,
      users: expiredUsers.map((u) => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        expiryDate: u.subscriptionExpiryDate,
      })),
    };
  } catch (error) {
    console.error("Error expiring subscriptions:", error);
    throw error;
  }
};

/**
 * Get statistics about subscriptions
 */
const getSubscriptionStats = async () => {
  try {
    const now = new Date();
    
    const stats = {
      active: await User.countDocuments({
        subscriptionStatus: "active",
        subscriptionExpiryDate: { $gt: now },
      }),
      expired: await User.countDocuments({
        subscriptionStatus: "expired",
      }),
      expiringSoon: await User.countDocuments({
        subscriptionStatus: "active",
        subscriptionExpiryDate: {
          $gt: now,
          $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      }),
      total: await User.countDocuments({
        subscriptionStatus: { $in: ["active", "expired"] },
      }),
    };

    return stats;
  } catch (error) {
    console.error("Error getting subscription stats:", error);
    throw error;
  }
};

module.exports = {
  expireSubscriptions,
  getSubscriptionStats,
};

