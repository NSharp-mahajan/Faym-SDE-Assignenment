const mongoose = require('mongoose');

const recoveryTransactionSchema = new mongoose.Schema(
  {
    withdrawalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Withdrawal',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      enum: ['FAILED', 'REJECTED', 'CANCELLED'],
      required: true,
    },
    recoveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

recoveryTransactionSchema.index({ withdrawalId: 1 });
recoveryTransactionSchema.index({ userId: 1 });

module.exports = mongoose.model('RecoveryTransaction', recoveryTransactionSchema);
