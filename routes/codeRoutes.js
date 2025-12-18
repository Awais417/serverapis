const express = require("express");
const router = express.Router();
const codeController = require("../controllers/codeController");

// Handle OPTIONS for code routes
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

// Create a new code
router.post("/", codeController.createCode);

// Create multiple codes at once
router.post("/bulk", codeController.createBulkCodes);

// Get all codes (with optional query params: ?isActive=true&search=xxx&page=1&limit=100)
router.get("/", codeController.getAllCodes);

// Get a code by ID
router.get("/:id", codeController.getCodeById);

// Get a code by code string
router.get("/code/:code", codeController.getCodeByCode);

// Update a code
router.put("/:id", codeController.updateCode);

// Delete a code
router.delete("/:id", codeController.deleteCode);

module.exports = router;

