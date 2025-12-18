const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: false, // Keep original case
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
codeSchema.index({ code: 1 });
codeSchema.index({ isActive: 1 });

const Code = mongoose.model("Code", codeSchema);

module.exports = Code;

