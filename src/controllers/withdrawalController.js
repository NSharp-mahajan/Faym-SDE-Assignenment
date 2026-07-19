const WithdrawalService = require('../services/WithdrawalService');
const Withdrawal = require('../models/Withdrawal');

exports.createWithdrawal = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || amount === undefined) {
      return res.status(400).json({ success: false, message: 'userId and amount are required' });
    }

    const withdrawal = await WithdrawalService.createWithdrawal(userId, amount);
    return res.status(201).json({ success: true, message: 'Withdrawal created successfully', data: withdrawal });
  } catch (error) {
    if (error.message.includes('greater than 0') || error.message.includes('User not found')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

exports.getWithdrawalById = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }
    return res.status(200).json({ success: true, message: 'Withdrawal fetched successfully', data: withdrawal });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};
