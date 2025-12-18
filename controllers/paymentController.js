const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

// POST /payment/create-checkout-session
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { userId, amount, currency = "usd" } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        error: {
          code: "400",
          message: "User ID and amount are required",
        },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: {
          code: "404",
          message: "User not found",
        },
      });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: "Premium Subscription",
              description: "Premium account access",
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/payment-cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.status(200).json({
      message: "Checkout session created",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Create checkout session error:", error);
    next(error);
  }
};

// POST /payment/webhook - Stripe webhook handler
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            user.paymentStatus = true;
            user.paymentDate = new Date();
            await user.save();
            console.log(`Payment successful for user: ${userId}`);
          }
        }
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

// GET /payment/status/:userId - Get user payment status
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Log the user ID being requested
    console.log("Payment status requested for user ID:", userId);

    // Set CORS headers explicitly
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (!userId) {
      return res.status(400).json({
        error: {
          code: "400",
          message: "User ID is required",
        },
      });
    }

    const user = await User.findById(userId).select("username email paymentStatus paymentDate");

    if (!user) {
      return res.status(404).json({
        error: {
          code: "404",
          message: "User not found",
        },
        requestedUserId: userId, // Include the ID that was requested
      });
    }

    res.status(200).json({
      message: "Payment status retrieved",
      requestedUserId: userId, // Include the ID that was requested
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        paymentStatus: user.paymentStatus || false,
        paymentDate: user.paymentDate || null,
      },
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    // Set CORS headers even on error
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next(error);
  }
};

// POST /payment/verify-session - Verify payment after redirect
exports.verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: {
          code: "400",
          message: "Session ID is required",
        },
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const userId = session.metadata?.userId;
      if (userId) {
        const user = await User.findById(userId);
        if (user && !user.paymentStatus) {
          user.paymentStatus = true;
          user.paymentDate = new Date();
          await user.save();
        }
      }

      res.status(200).json({
        message: "Payment verified successfully",
        paid: true,
        sessionId: session.id,
      });
    } else {
      res.status(200).json({
        message: "Payment not completed",
        paid: false,
        sessionId: session.id,
      });
    }
  } catch (error) {
    console.error("Verify session error:", error);
    next(error);
  }
};


