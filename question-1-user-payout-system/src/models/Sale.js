const mongoose = require('mongoose');

// Sale schema for tracking user earnings and approval statuses
const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    earnings: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    advancePaid: {
      type: Boolean,
      default: false,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    reconciledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add index on status for efficient querying of approved/pending sales
saleSchema.index({ status: 1 });

module.exports = mongoose.model('Sale', saleSchema);
