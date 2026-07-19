const mongoose = require('mongoose');

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
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
    },
    gatewayReference: {
      type: String,
    },
    requestedAt: {
      type: Date,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ status: 1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
