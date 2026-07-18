const Withdrawal = require('../models/Withdrawal');
const WithdrawalService = require('../services/WithdrawalService');

exports.withdraw = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const result = await WithdrawalService.withdraw(userId);
    return res.status(201).json({ success: true, message: 'Withdrawal successful', data: result });
  } catch (error) {
    let status = 400;
    if (error.message.includes('within the last 24 hours')) status = 409;
    else if (error.message.includes('Insufficient available balance')) status = 400;
    
    return res.status(status).json({ success: false, message: error.message });
  }
};

exports.getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.params.userId }).sort({ requestedAt: -1 });
    return res.status(200).json({ success: true, message: 'User withdrawals retrieved successfully', data: withdrawals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
