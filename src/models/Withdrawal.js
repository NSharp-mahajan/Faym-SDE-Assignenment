const mongoose = require('mongoose');

// Withdrawal schema for tracking user-initiated payout requests
const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for efficient user and time-based queries
withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ requestedAt: 1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
