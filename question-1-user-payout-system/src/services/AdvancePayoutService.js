const Sale = require('../models/Sale');
const Payout = require('../models/Payout');

/**
 * Runs the advance payout process for all eligible pending sales.
 * Ensures idempotency to avoid duplicate payouts on concurrent runs.
 * 
 * @returns {Object} Statistics detailing processed and skipped sales.
 */
const runAdvancePayout = async () => {
  let processed = 0;
  let skipped = 0;

  // 1. Find all sales where status is Pending and advancePaid is false
  const pendingSales = await Sale.find({
    status: 'Pending',
    advancePaid: false
  });

  for (const sale of pendingSales) {
    // 2. Skip sales where earnings <= 0
    if (sale.earnings <= 0) {
      skipped++;
      continue;
    }

    // 3. Calculate advance amount (10% of earnings)
    const advance = sale.earnings * 0.10;

    // Idempotency Guard: Atomically update the sale ONLY IF advancePaid is still false
    const updatedSale = await Sale.findOneAndUpdate(
      { _id: sale._id, advancePaid: false },
      { advancePaid: true, advanceAmount: advance },
      { new: true } // Returns the modified document rather than the original
    );

    // If updatedSale is null, another process already picked up this record
    if (updatedSale) {
      // 4. Create a SUCCESS Payout document
      await Payout.create({
        userId: sale.userId,
        saleId: sale._id,
        type: 'ADVANCE',
        amount: advance,
        status: 'SUCCESS',
        processedAt: new Date()
      });
      processed++;
    } else {
      skipped++;
    }
  }

  // 6. Return stats
  return {
    processed,
    skipped
  };
};

module.exports = {
  runAdvancePayout
};
