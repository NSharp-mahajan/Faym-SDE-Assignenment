const Payout = require('../models/Payout');
const AdvancePayoutService = require('../services/AdvancePayoutService');

exports.runAdvancePayout = async (req, res) => {
  try {
    const stats = await AdvancePayoutService.runAdvancePayout();
    return res.status(200).json({ success: true, message: 'Advance payouts processed successfully', data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: 'User payouts retrieved successfully', data: payouts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayoutById = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found' });
    }
    
    return res.status(200).json({ success: true, message: 'Payout retrieved successfully', data: payout });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
