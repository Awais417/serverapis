const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentController = require("./controllers/paymentController");

dotenv.config();

const app = express();

// CORS configuration - allow all origins, no credentials
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  credentials: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Stripe webhook needs raw body for signature verification
app.use(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

// Body parser for other routes
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send(`App is working fine`);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  
  // Return error in format Unity expects
  res.status(err.status || 500).json({
    error: {
      code: String(err.status || 500),
      message: err.message || "A server error has occurred"
    }
  });
});

// Vercel handler export
module.exports = app;

// Local dev server
if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
  });
}
