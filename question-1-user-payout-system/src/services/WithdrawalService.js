const mongoose = require('mongoose');
const Withdrawal = require('../models/Withdrawal');
const Payout = require('../models/Payout');

/**
 * Executes a full withdrawal of the user's available balance.
 * 
 * @param {String} userId - The user ID attempting to withdraw.
 * @returns {Object} Contains withdrawnAmount and remainingBalance.
 */
const withdraw = async (userId) => {
  // 1. Find the most recent withdrawal for this user
  const latestWithdrawal = await Withdrawal.findOne({ userId })
    .sort({ requestedAt: -1 });

  // Prevent multiple withdrawals within a 24-hour window
  if (latestWithdrawal) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (latestWithdrawal.requestedAt > oneDayAgo) {
      throw new Error('A withdrawal was already requested within the last 24 hours');
    }
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 2. Calculate total incoming funds (Sum of all SUCCESS payouts)
  const payoutStats = await Payout.aggregate([
    { $match: { userId: userObjectId, status: 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalPayouts = payoutStats.length > 0 ? payoutStats[0].total : 0;

  // Calculate total outgoing funds (Sum of all SUCCESS withdrawals)
  const withdrawalStats = await Withdrawal.aggregate([
    { $match: { userId: userObjectId, status: 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalWithdrawals = withdrawalStats.length > 0 ? withdrawalStats[0].total : 0;

  // Compute available balance
  const availableBalance = totalPayouts - totalWithdrawals;

  // 3. Ensure the user has enough balance to withdraw
  if (availableBalance <= 0) {
    throw new Error('Insufficient available balance for withdrawal');
  }

  // 4. Create SUCCESS withdrawal record
  await Withdrawal.create({
    userId,
    amount: availableBalance,
    status: 'SUCCESS',
    processedAt: new Date()
  });

  // 5. Return success metrics
  return {
    withdrawnAmount: availableBalance,
    remainingBalance: 0 // The full balance was successfully withdrawn
  };
};

module.exports = {
  withdraw
};
