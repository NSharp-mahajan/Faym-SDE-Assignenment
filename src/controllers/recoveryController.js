const RecoveryService = require('../services/RecoveryService');
const RecoveryTransaction = require('../models/RecoveryTransaction');

exports.updateWithdrawalStatus = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const result = await RecoveryService.updateWithdrawalStatus(withdrawalId, status);
    return res.status(200).json({ success: true, message: 'Withdrawal status updated successfully', data: result });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Invalid status') || error.name === 'CastError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message.includes('already been processed')) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

exports.getRecoveryHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await RecoveryTransaction.find({ userId }).sort({ recoveredAt: -1 });
    
    return res.status(200).json({ success: true, message: 'Recovery history fetched successfully', data: history });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid userId format' });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
