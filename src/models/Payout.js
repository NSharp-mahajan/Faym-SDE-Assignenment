const mongoose = require('mongoose');

// Payout schema representing the internal payment records related to sales
const payoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
      required: true,
    },
    type: {
      type: String,
      enum: ['ADVANCE', 'FINAL', 'ADJUSTMENT'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
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

// Add indexes for efficient querying by user or sale
payoutSchema.index({ userId: 1 });
payoutSchema.index({ saleId: 1 });

module.exports = mongoose.model('Payout', payoutSchema);
