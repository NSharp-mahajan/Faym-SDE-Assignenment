const Sale = require('../models/Sale');
const User = require('../models/User');

/**
 * Creates a new sale for a given user.
 * 
 * @param {String} userId - The ID of the user.
 * @param {Number} earnings - The earnings from the sale.
 * @returns {Object} The created sale document.
 */
const createSale = async (userId, earnings) => {
  // Verify earnings rule
  if (earnings < 0) {
    throw new Error('Earnings must be greater than or equal to 0');
  }

  // Verify the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Create the sale
  const sale = await Sale.create({
    userId,
    earnings,
    status: 'Pending',
    advancePaid: false,
    advanceAmount: 0
  });

  return sale;
};

module.exports = {
  createSale
};
