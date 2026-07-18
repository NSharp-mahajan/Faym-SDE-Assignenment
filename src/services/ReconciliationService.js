const Sale = require('../models/Sale');
const Payout = require('../models/Payout');

/**
 * Reconciles a pending sale by transitioning its state to Approved or Rejected.
 * Creates the necessary payout adjustments.
 * 
 * @param {String} saleId - The ID of the sale to reconcile.
 * @param {String} status - The target status ('Approved' or 'Rejected').
 * @returns {Object} The updated sale document.
 */
const reconcileSale = async (saleId, status) => {
  // Validate the incoming status
  if (!['Approved', 'Rejected'].includes(status)) {
    throw new Error('Invalid status. Must be "Approved" or "Rejected"');
  }

  // Find the sale
  const sale = await Sale.findById(saleId);
  if (!sale) {
    throw new Error('Sale not found');
  }

  // Ensure sale has not already been reconciled
  if (sale.status === 'Approved' || sale.status === 'Rejected') {
    throw new Error(`Sale has already been reconciled as ${sale.status}`);
  }

  let payoutAmount = 0;
  let payoutType = '';

  if (status === 'Approved') {
    // Pay the remaining balance (Earnings - Advance previously paid)
    payoutAmount = sale.earnings - sale.advanceAmount;
    payoutType = 'FINAL';
  } else if (status === 'Rejected') {
    // Recapture the advance paid by applying a negative payout
    payoutAmount = -sale.advanceAmount;
    payoutType = 'ADJUSTMENT';
  }

  // Create the final or adjustment payout
  await Payout.create({
    userId: sale.userId,
    saleId: sale._id,
    type: payoutType,
    amount: payoutAmount,
    status: 'SUCCESS',
    processedAt: new Date()
  });

  // Update sale status and store reconciliation timestamp
  sale.status = status;
  sale.reconciledAt = new Date();
  await sale.save();

  return sale;
};

module.exports = {
  reconcileSale
};
