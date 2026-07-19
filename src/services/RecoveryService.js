const Withdrawal = require('../models/Withdrawal');
const RecoveryTransaction = require('../models/RecoveryTransaction');

/**
 * Updates the status of a pending withdrawal.
 * If the status is a failure type, it automatically triggers a recovery transaction.
 * Uses atomic MongoDB operations to strictly enforce idempotency.
 * 
 * @param {String} withdrawalId - The ID of the withdrawal to update.
 * @param {String} status - The target status (SUCCESS, FAILED, REJECTED, CANCELLED).
 * @returns {Object} The updated withdrawal and optional recovery transaction.
 */
const updateWithdrawalStatus = async (withdrawalId, status) => {
  // Validate allowed statuses
  const allowedStatuses = ['SUCCESS', 'FAILED', 'REJECTED', 'CANCELLED'];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
  }

  // 1. Atomically update the withdrawal ONLY IF it is currently PENDING.
  // This prevents race conditions and ensures idempotency because only one thread
  // can successfully transition the state away from PENDING.
  const updatedWithdrawal = await Withdrawal.findOneAndUpdate(
    { _id: withdrawalId, status: 'PENDING' },
    { status, processedAt: new Date() },
    { new: true } // Return the modified document
  );

  // 2. Handle cases where the atomic update didn't match any document
  if (!updatedWithdrawal) {
    const existing = await Withdrawal.findById(withdrawalId);
    if (!existing) {
      throw new Error('Withdrawal not found');
    }
    // If it exists but wasn't PENDING, it has already been processed
    throw new Error(`Withdrawal has already been processed with status: ${existing.status}`);
  }

  let recoveryTransaction = null;
  const failureStatuses = ['FAILED', 'REJECTED', 'CANCELLED'];

  // 3. If the final status is a failure reason, create a RecoveryTransaction
  if (failureStatuses.includes(status)) {
    // Because the atomic update above was guaranteed exclusive, 
    // we will never create duplicate recovery transactions.
    recoveryTransaction = await RecoveryTransaction.create({
      withdrawalId: updatedWithdrawal._id,
      userId: updatedWithdrawal.userId,
      amount: updatedWithdrawal.amount,
      reason: status, // The reason directly maps to the failure status
      recoveredAt: new Date()
    });
  }

  // 4. Return meaningful success object
  return {
    withdrawal: updatedWithdrawal,
    recoveryTransaction
  };
};

module.exports = {
  updateWithdrawalStatus
};
