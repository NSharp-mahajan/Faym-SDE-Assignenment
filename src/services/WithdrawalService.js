const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');

/**
 * Creates a new pending withdrawal for the user.
 * 
 * @param {String} userId - The ID of the user requesting withdrawal.
 * @param {Number} amount - The amount to withdraw.
 * @returns {Object} The created withdrawal document.
 */
const createWithdrawal = async (userId, amount) => {
  // Validate amount
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Verify the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Create the withdrawal document
  const withdrawal = await Withdrawal.create({
    userId,
    amount,
    status: 'PENDING',
    requestedAt: new Date(),
  });

  return withdrawal;
};

module.exports = {
  createWithdrawal
};
